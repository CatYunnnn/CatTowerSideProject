# 簡單的養成小遊戲

利用 Node.js 和 MongoDB Atlas 打造的養成小遊戲，透過過關得到金幣去升級或著購買新的角色。

# 已完成

1.預設的種子資料

2.基本 UI

3.商店基本功能

4.技能樹基本功能

5.基礎戰鬥 UI、戰鬥資料

6.戰鬥完的結果 e.g.金幣的增加，關卡層數的遞進

# 尚未完成

1.註冊頁面(UI、功能)

2.基本關卡資料推進

3.角色資料庫

4.角色基本參數顯示

5.關卡層數顯示

# 如何建立

1.將專案 clone 到本地端

2.安裝所需套件

`npm install`

3.設定 mongoDB Atlas 環境變數

`MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.oox40uh.mongodb.net/expense?retryWrites=true&w=majority`

4.產出種子資料

`npm run seed`

5.啟動伺服器

`npm run dev`

# 開發工具

- Node.js 16.17.1
- Express 4.18.2
- Express-handlebars 7.0.7
- Express-session 1.17.3
- MongoDB Atlas
- Mongoose 7.3.1
- Passport 0.6.0
- Passport-local 1.0.0
- Axios 1.4.0
- Dotenv 16.3.1
- Font-awesome
