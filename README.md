## NodeJS API with MVC Structure [Compatible All Platform] [EN]

I have developed an API structure compatible with all platforms with NodeJS. It is possible for you to respond to advanced level requests within this API structure. The project is in a compact structure.you can make general adjustments via the env file. You can develop web applications, desktop applications and mobile applications. You can customize your environment variables and increase the scope depending on your project.

## Requirements

It refers to the infrastructure required to operate the project.

`NodeJS Version => v20.11.1`

`NPM Version => 10.5.0`

  
## Installation

Clone the project

```bash
  git clone https://github.com/eush35/nodejsAPI.git
```

Go to the project directory

```bash
  cd nodejsAPI/app
```

Install required packages

```bash
  npm install
```

Run the server

```bash
  node app.js
```
Running

```bash
  http://localhost:8080
```
  
## Folder Structure
- app dir /app

- database & auth /config

- Routing /routes

- Controllers /controllers

- Models /models

- CSS & JS /public

- HTML Files /views

## API Tutorial

#### Login Authentication with JWT [Token and Cookie assigned]

```http
  POST /login
```

| Body | Tip     | Açıklama                |
| :-------- | :------- | :------------------------- |
| `email` | `string` | **admin@mail.com** & **customer@mail.com** |
| `password` | `string` | **123456** |


#### If the admin login has been made, the API usage can be continued.



| Table Name|  AdminAuth    | Model |
| :-------- | :------- | :-------------------------------- |
| `admins`      | `Allowed` | **AdminUserModel**  |

```http
  GET /admin => Admin Page
  GET /admins => Admin List
  GET /admin/detail/:id => Admin Detail
  POST /admin/create => Admin Create
  PUT /admin/edit/:id => Admin Update
  DELETE /admin/delete/:id => Admin Delete
```
| Table Name|  AdminAuth    | Model |
| :-------- | :------- | :-------------------------------- |
| `customers`      | `Allowed` | **CustomerUserModel**  |

```http
  GET /customer => Customer Page
  GET /customers => Customer List
  GET /customer/detail/:id => Customer Detail
  POST /customer/create => Customer Create
  PUT /customer/edit/:id => Customer Update
  DELETE /customer/delete/:id => Customer Delete
```
| Table Name|  AdminAuth    | Model |
| :-------- | :------- | :-------------------------------- |
| `products`      | `Allowed` | **productModel**  |

```http
  GET /products => Product List
  GET /product/detail/:id => Product Detail
  POST /product/create => Product Create
  PUT /product/edit/:id => Product Update
  DELETE /product/delete/:id => Product Delete
```
| Table Name|  AdminAuth    | Model  |
| :-------- | :------- | :-------------------------------- |
| `categories`      | `Allowed` | **categoryModel** |

```http
  GET /categories => Category List
  GET /category/detail/:id => Category Detail
  POST /category/create => Category Create
  PUT /category/edit/:id => Category Update
  DELETE /category/delete/:id => Category Delete
```

