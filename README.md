## Step-1)First go to project directory
## Step-2)cd client  (go to client directory)


1. **Fill values of all the keys in `.env.local` file**

     Go To Cloudinary ,SignUp and than go to the dashboard
     ![image](https://github.com/user-attachments/assets/334de7c6-ad13-4593-a461-ed785b1f30a8)

      Generate API Key and than copy cloud name and paste it in the .env.local file for this key NEXT_PUBLIC_UPLOAD_PRESENT, after it go to Upload Presets
     ![image](https://github.com/user-attachments/assets/773621db-8d4d-4224-909b-605f5fe89258)

     Fill Upload presets name and select Unsigned in Signing mode and save it. Now paste this Upload presets name to the .env.local file for NEXT_PUBLIC_UPLOAD_PRESETS.
     ![image](https://github.com/user-attachments/assets/28b74b01-1d5a-495c-a4e1-5ebec4818e9e)




4. **Install dependencies** by running the following command in your terminal:

    ```bash
    npm i
    ```

5. **Start the client** with:

    ```bash
    npm run dev
    ```

## Step-3) cd server (go to server directory)

1. **Fill values of all the keys in `.env` file**  You can skip this part if you  use default values given in file
-	`PORT=8000`
-	`MONGOURI=mongodb://localhost:27017/urja_talents`
-	`JWT_SECRET_KEY=maurya48ashish`
-	`FRONTEND_URI=http://localhost:3000`
-	`KEY=0db8505fbb92d150e2d1b5937ab6df159858bda0c63bc938d69cbb945488d65b`          {32 byte Random String}
-	`ENCIV=9db4b02899658f05362cf693bd64ba2f`     {16 byte Random String}

3. **Install dependencies** by running the following command in your terminal:

    ```bash
    npm i
    ```
4. **Start the server** with:

    ```bash
    npm start or node index.js
    ```
