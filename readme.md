## **Overview**

A simple application consisting of a custom restful API and a simple React frontend. The application provides for a user to create and manage virtual vending machines. Each user may have many machines. Each machine supports an unlimited number of types of products and up to 15 items in inventory (i.e. 1 machine may hold up to 15pcs of the same product). In addition, the machine works with coins with the following denominations `0.01, 0.02, 0.05, 0.10, 0.20, 0.50, 1, 2 EUR`. It accepts user input and returns the correct amount of change. The UI supports simple light and dark mode.

The application supports minimalistic Auth implementation as a proof of concept. However, any guest may purchase any item from the available machines. Any registered user may preview a list of his machines as a dropdown. Upon selection the user may refill coin storage, may add new products and can load or remove products from the machine's inventory. The machines can be renamed. In addition, a registered user may create products by providing `name, description, price, imageUrl`. Only after creating a product, the user may add it to a machine.

Any logged-in user or guest may purchase a product from any existing machine, provided there is inventory. The machine accepts any number of coins in the above denominations and calculates whether it can return the correct change. If there are not enough coins it will refund the given coins. If a purchase is successful, the machine decreases the product's current inventory with the user-specified amount, returns the relevant change and refills its coin stacks from the user input. if any of these stacks becomes more than 50, the difference goes into the overflow bin and its coin contents are not tracked anymore.

## **Technologies Used**:

-   API:

    -   javascript,
    -   bcryptjs - to hash passwords,
    -   cookie-parser - a simpler surface to work with cookies,
    -   cors - a simpler way to solve CORS errors,
    -   dotenv - used to load environment variables
    -   express,
    -   jsonwebtoken - to sign and pars JWT,
    -   mongoose - MongoDB ORM to bring some structure and ease of use

-   WebApp
    -   TypeScript,
    -   VITE cli to generate the app
    -   Material UI - an elaborate component library,
    -   react-router-dom - a router,
    -   react-toastify - provides nice toaster messages

## **GETTING STARTED**

1. make sure to have a local `mongoDB` instance;
    - additional resources: https://www.mongodb.com/try/download/community
2. add the relevant strings to the `.env` config for both `./server` and `./client`;
3. run `npm install` in separate terminal for `./server`;
4. run `npm start` in separate terminal for `./server`;
5. run `npm install` in separate terminal for `./client`;
6. run `npm run dev` in separate terminal for `./client`;
