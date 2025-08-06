const express = require('express');
const cors = require('cors'); 
const oracledb = require('oracledb');
const connectDB = require('./db');

const app = express();
const PORT = 3000;

app.use(cors());  
app.use(express.json());

// ✅ /test route
app.get('/test', async (req, res) => {
  const conn = await connectDB();
  if (!conn) return res.status(500).send('DB Connection Failed');

  try {
    const result = await conn.execute('SELECT table_name FROM user_tables');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    await conn.close();
  }
});

// ✅ /products route
app.get('/products', async (req, res) => {
  console.log('✅ /products route hit');
  const conn = await connectDB();
  if (!conn) return res.status(500).send('DB Connection Failed');

  try {
    const result = await conn.execute(`
      SELECT IDPRODUCT, PRODUCTNAME, PRODUCTIMAGE, PRICE 
      FROM CF_PRODUCT
      FETCH FIRST 50 ROWS ONLY
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    await conn.close();
  }
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend server running at http://localhost:${PORT}`);
});

// ✅ POST /orders
app.post('/orders', async (req, res) => {
  const { customerId, items } = req.body;

  const conn = await connectDB();
  if (!conn) return res.status(500).send('DB Connection Failed');

  try {
    // 插入訂單並取得新 IDORDER
    const result = await conn.execute(
      `INSERT INTO CF_ORDER (IDORDER, IDCUSTOMER, ORDERDATE)
       VALUES (CF_ORDER_SEQ.NEXTVAL, :customerId, SYSDATE)
       RETURNING IDORDER INTO :orderId`,
      {
        customerId,
        orderId: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
      },
      { autoCommit: false }
    );

    const orderId = result.outBinds.orderId[0];
    let totalAmount = 0;

    for (const item of items) {
      const { id, quantity } = item;

      // 查詢產品價格
      const priceResult = await conn.execute(
        `SELECT PRICE FROM CF_PRODUCT WHERE IDPRODUCT = :id`,
        { id }
      );
      const price = priceResult.rows[0][0];
      const lineTotal = price * quantity;
      totalAmount += lineTotal;

      // 取得新 IDORDERITEM
      const seqResult = await conn.execute(`SELECT SEQ_ORDER.NEXTVAL AS ID FROM DUAL`);
      const newId = seqResult.rows[0][0];

      // 插入 CF_ORDER_ITEM（加上 LINETOTAL）
      await conn.execute(
        `INSERT INTO CF_ORDER_ITEM (IDORDERITEM, IDORDER, IDPRODUCT, QUANTITY, LINETOTAL)
         VALUES (:IDORDERITEM, :IDORDER, :IDPRODUCT, :QUANTITY, :LINETOTAL)`,
        {
          IDORDERITEM: newId,
          IDORDER: orderId,
          IDPRODUCT: id,
          QUANTITY: quantity,
          LINETOTAL: lineTotal
        }
      );

      // 減少庫存
      await conn.execute(
        `UPDATE CF_PRODUCT SET STOCK = STOCK - :quantity WHERE IDPRODUCT = :id`,
        { quantity, id }
      );
    }

    // 更新 CF_ORDER.TOTALAMOUNT
    await conn.execute(
      `UPDATE CF_ORDER SET TOTALAMOUNT = :totalAmount WHERE IDORDER = :orderId`,
      { totalAmount, orderId }
    );

    await conn.commit();
    res.status(201).json({ message: 'Order created', orderId, totalAmount });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ error: err.message });
  } finally {
    await conn.close();
  }
});