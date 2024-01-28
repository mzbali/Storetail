# Storetail

Storetail is an e-commerce website built with .Net 8 and React. It uses a variety of libraries and packages to provide a robust and user-friendly shopping experience. visit the live site [here](https://storetail.mzbali.com/catalog).

## Demo


https://github.com/mzbali/Storetail/assets/25793615/d24f0514-3e23-4c26-b550-ab4574ec0e4e


## Tech Stack

### Back-end

- [.NET 8 Core](https://dotnet.microsoft.com/en-us/download) - Backend framework
- [Entity Framework Core](https://github.com/dotnet/efcore) - Object-Relational Mapping (ORM) framework
- [PostgreSQL](https://www.postgresql.org/) - Open-source SQL database to store data
- [Stripe](https://stripe.com/) - For payment processing

### Front-end

- [React](https://reactjs.org/) - Frontend framework
- [Vite](https://vitejs.dev/) - Build tool and development server
- [MUI](https://mui.com/) - A comprehensive set of React components for building user interfaces
- [React Hook Form](https://react-hook-form.com/) - Library for flexible & extensible forms
- [Redux](https://redux.js.org/) - A Predictable State Container for JS Apps
- [React Router Dom](https://reactrouter.com/) - Declarative routing for React
- [React Toastify](https://fkhadra.github.io/react-toastify/) - Allows you to add notifications to your app with ease
- [Yup](https://github.com/jquense/yup) - Dead simple Object schema validation

## Features

- User authentication with JWT (login/register)
- CRUD operations for products
- Shopping cart functionality
- Payment processing with Stripe
- Product search and filter
- User profile and order history
- Responsive design for all screens

## Usage

## Configuration

Before running the application locally, you need to set up the environment variables for both the frontend and the backend.

### Frontend

Create a `.env.local` file in the root of the frontend directory and add the following:

```env
VITE_APP_API_URL=http://localhost:5000/api/
```

Replace `VITE_APP_URL` with your actual backend URL.

Run client development server assuming you have Node.js installed and `npm` or `yarn` or `pnpm` installed:

I Reccomend using `pnpm` as it is the manager I used to build this project.

```bash
cd client
npm install
npm run dev
```

### Backend

Update the `appsettings.Development.json` or `appsettings.json` depending where you running it file in the root of the backend directory with the following:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Port=5432;Database=storetail;User Id=your_postgres_user_id;Password=your_postgres_password;"
  },
  "StripeSettings": {
    "PublicKey": "your_stripe_public_key",
    "SecretKey": "your_stripe_secret_key",
    "WhSecret": "your_stripe_webhook_secret"
  }
}
```

Run backend development server assuming you have .NET 6 installed:

```bash
cd API
dotnet restore
dotnet watch run
```

Replace `your_postgres_user_id`, `your_postgres_password`, `your_stripe_public_key`, `your_stripe_secret_key`, and `your_stripe_webhook_secret` with your actual values.

Happy coding! 🚀
