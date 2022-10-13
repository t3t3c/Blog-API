### 0. To run with babel and environment variables and cors

```bash
npm install @babel/core @babel/node --save-dev
```

add to npm start script:

```json
    "start": "nodemon --exec babel-node src/index.js",
```

add most common used Babel preset to your application:

```bash
npm install @babel/preset-env --save-dev
```

create .babelrc file in the command line `touch .babelrc`

in this configuration file for Babel you can include the recently installed dependency:

```json
// .babelrc file
{
  "presets": ["@babel/preset-env"]
}
```

#### 2. .env with es6

1. `touch .env` to create file, `npm i dotenv` to install dotenv
2. import dotenv:

```js
// As early as possible in your application, import and configure dotenv:

require('dotenv').config();
console.log(process.env); // remove this after you've confirmed it is working
```

ES6 WAY like this:

```js
import 'dotenv/config';
```

or like this (from dotenv documentation):

```js
import * as dotenv from 'dotenv'; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();
```

IF YOU WANT TO USE ENVIRONMENT VARIABLES INSIDE OF OTHER MODULE, REMEMBER TO PUT IT FIRST:

```js
import 'dotenv/config';

import saySomething from './my-other-file.js';
```

#### 3. cors

CORS - cross-origin resource sharing

- application-level middleware to add the CORS HTTP header to every request by default. We could write a middleware ourseles or use a library.

- `npm install cors`
- `import cors from cors`
- `app.use(cors())`

### 1. require express

### 2. start an app with `const app = express()`

### 3. start listening with app.listen `app.listen(3000)`

### 4. setup view engine with `app.set('view engine', 'ejs');`

- you can do: `app.set('views', path.join(__dirname, 'views'));` to show where is the folder

### 5. make public folder public with `app.use(express.static('public'))`

You can call static multiple times to serve multiple directories (If it not find a file on one middleware then it checks the other one.)

you can also do a virtual prefix: `app.use('/media', express.static('public'));`

- you can do: `app.use(express.static(path.join(__dirname, 'public')));` if you want to be more pro

### 6. add body parser middleware

- to handle json: `app.use(express.json())`
- to handle forms (url encoding): `app.use(express.urlencoded({ extended: false }));`

### 6. add views and partials in `root/views/partials` with ejs `<%-include(./partials/head.ejs) >`

### 7. add css in head of every file with head partial and `src="/styles.css"`

### 8. start add addiing routes with

```js
app.get('/', (req, res) => {
  res.render('filename', { props: 'text', VariableSameAsKey });
});
```

### 9. To use routes:

```js
const routeRouter = require('./routes/route');
app.use('/route', routeRouter);
```

- inside of router:

```js
const router = express.Router();
router.get('/', () => {});
module.exports = router;
```

- you can also do this for varios requests:

```js
router
  .route('/:id')
  .get((req, res) => {
    console.log(req.params.id);
  })
  .put()
  .delete();
```

- access route parameters:

This is an url: `http://localhost:3000/users/34/books/8989`

```js
app.get('/users/:userId/books/:bookId', (req, res) => {
  // Access userId via: req.params.userId
  // Access bookId via: req.params.bookId
  res.send(req.params);
});
```

If you are using controllers:

```js
// require controller modules

const book_controller = require('../controllers/bookController');

// use one of the exported functions
router.get('/', book_controller.index);
```

### 10. add Controllers

Controllers take information from the database, work with it and send that information to the view so it can be shown.

Require models you are going to use:

```js
const Bicycle = require('../models/bicycle');
```

Controller scheleton:

```js
exports.author_detail = (req, res) => {
  res.send(`NOT IMPLEMENTED: Author detail: ${req.params.id}`);
};
```

Working controler function

```js
// Display list of all Books.
exports.book_list = function (req, res, next) {
  Book.find({}, 'title author')
    .sort({ title: 1 })
    .populate('author')
    .exec(function (err, list_books) {
      if (err) {
        return next(err);
      }
      //Successful, so render
      res.render('book_list', { title: 'Book List', book_list: list_books });
    });
};
```

### 10. add middleware (with next and app.use) `app.use((req, res, next) => {//code; next();});`

```js
const myLogger = function (req, res, next) {
  console.log('Request IP: ' + req.ip);
  console.log('Request Method: ' + req.method);
  console.log('Request date: ' + new Date());

  next(); // THIS IS IMPORTANT!
};

app.use(myLogger);
```

### 11. Add Views:

- to add a partial:

```html
<%- include('./partials/head.ejs') %>
```

- to declare a variable:

```html
<% const name = 'mario' %>
```

- to loop through (blogs is passed as a parameter):

```html
<!-- prettier-ignore -->
<div class="blogs content">
      <h2>All Blogs</h2>
      <p><%= name %></p>
      <% if (blogs.length > 0) { %>
        <% blogs.forEach((blog) => { %>
          <h3 class="title"><%= blog.title %></h3>
          <p class="snippet"><%= blog.snippet %></p>
        <% }) %>
      <% } else { %>
        <p>There are no blogs to display</p>
      <% } %>
    </div>
<!-- prettier-ignore -->
```

- to add props:

```js
res.render('index', { title: 'Home', blogs });
// express will look for that file in view folder
// it will choose index.ejs instead of index.html
```

- to use parameter inside partials:
  https://community.wappler.io/t/how-can-i-use-parameter-inside-partials/21877/4

- safer way to access props:

```html
<body>
  <!--'=' means output that code to the page -->
  <!-- locals will always be defined, and so no error -->

  Hello <%= locals.text || 'Default' %>
</body>
```

### 11. Add error handling with:

```js
app.use((req, res) => {
  res.status(404).render('404', { title: '404' });
});
```

MDN way:

```js
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('something broke!');
});
```

### 12. add redirects with `res.redirect('/path')`

### 13. Add forms:

#### 1. Adding Express-validator

- Specify functions you want to use:

```js
const { body, validationResult } = require('express-validator');
```

`body([fields, message])` - fields to validate or sanitze, and optional error message.

```js
  // .trim() - removes whitespace
  // isLength({ min: 1}) checks if it is not empty
  // .escape() to remove HTML characters from the variable
  // to prevent JavaScript cross-site scripting attacks.
  body('name', 'Empty name').trim().isLength({ min: 1 }).escape(),
```

```js
// optional to specify that null and apmty strings will NOT fail validation
body('age', 'Invalid age')
  .optional({ checkFalsy: true })
  .isISO8601()
  .toDate(),
```

Add messages that are displayed if the preceding validators are true.

```js
body("name")
  .trim()
  .isLength({ min: 1 })
  .withMessage("Name empty.")
  .isAlpha()
  .withMessage("Name must be alphabet letters."),
```

`validationResult(req)` - runs the validation returns an error if there was an.

```js
(req, res, next) => {
  // Extract the validation errors from a request.
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // wtf is that shit
    // There are errors. Render form again with sanitized values/errors messages.
    // Error messages can be returned in an array using `errors.array()`.
    errors.array().forEach((error) => {
      console.log(error);
    });
  } else {
    // Data from form is valid.
  }
};
```

#### 2. Form Design

- form can only create an object using objects that already exist
- delete an object that is not referenced by other objects!

#### 3.Routes

get - to display
post - to validate, save and redirect or errors

```js
// GET request for creating a Genre. NOTE This must come before route that displays Genre (uses id).
router.get('/genre/create', genre_controller.genre_create_get);

// POST request for creating Genre.
router.post('/genre/create', genre_controller.genre_create_post);
```

#### 4. Create get route

```js
// Display Genre create form on GET.
exports.genre_create_get = (req, res, next) => {
  res.render('genre_form', { title: 'Create Genre' });
};
```

#### 5. Create a post route

```js
// Handle Genre create on POST.
// why it is an array?
// the array of middleware functions is passed to the router function and each method is called in order.
// validators are middleware funcitons.
exports.genre_create_post = [
  // Validate and sanitize the name field.
  body('name', 'Genre name required').trim().isLength({ min: 1 }).escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a genre object with escaped and trimmed data.
    const genre = new Genre({ name: req.body.name });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render('genre_form', {
        title: 'Create Genre',
        genre,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.
      // Check if Genre with same name already exists.
      Genre.findOne({ name: req.body.name }).exec((err, found_genre) => {
        if (err) {
          return next(err);
        }

        if (found_genre) {
          // Genre exists, redirect to its detail page.
          res.redirect(found_genre.url);
        } else {
          genre.save((err) => {
            if (err) {
              return next(err);
            }
            // Genre saved. Redirect to genre detail page.
            res.redirect(genre.url);
          });
        }
      });
    }
  },
];
```

#### 6. Create a View

```js
extends layout

block content
  h1 #{title}

  form(method='POST' action='')
    div.form-group
      label(for='name') Genre:
      input#name.form-control(type='text', placeholder='Fantasy, Poetry etc.' name='name' value=(undefined===genre ? '' : genre.name))
    button.btn.btn-primary(type='submit') Submit

  if errors
   ul
    for error in errors
     li!= error.msg

```

#### 7. Adding a book form:

Controller:

```js
// Display book create form on GET.
exports.book_create_get = (req, res, next) => {
  // Get all authors and genres, which we can use for adding to our book.
  async.parallel(
    {
      authors(callback) {
        Author.find(callback);
      },
      genres(callback) {
        Genre.find(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      res.render('book_form', {
        title: 'Create Book',
        authors: results.authors,
        genres: results.genres,
      });
    }
  );
};
```

Controller-post route:

```js
// Handle book create on POST.
exports.book_create_post = [
  // Convert the genre to an array.
  (req, res, next) => {
    if (!Array.isArray(req.body.genre)) {
      req.body.genre =
        typeof req.body.genre === 'undefined' ? [] : [req.body.genre];
    }
    next();
  },

  // Validate and sanitize fields.
  body('title', 'Title must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('author', 'Author must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('summary', 'Summary must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('isbn', 'ISBN must not be empty').trim().isLength({ min: 1 }).escape(),
  body('genre.*').escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a Book object with escaped and trimmed data.
    const book = new Book({
      title: req.body.title,
      author: req.body.author,
      summary: req.body.summary,
      isbn: req.body.isbn,
      genre: req.body.genre,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.

      // Get all authors and genres for form.
      async.parallel(
        {
          authors(callback) {
            Author.find(callback);
          },
          genres(callback) {
            Genre.find(callback);
          },
        },
        (err, results) => {
          if (err) {
            return next(err);
          }

          // Mark our selected genres as checked.
          for (const genre of results.genres) {
            if (book.genre.includes(genre._id)) {
              genre.checked = 'true';
            }
          }
          res.render('book_form', {
            title: 'Create Book',
            authors: results.authors,
            genres: results.genres,
            book,
            errors: errors.array(),
          });
        }
      );
      return;
    }

    // Data from form is valid. Save book.
    book.save((err) => {
      if (err) {
        return next(err);
      }
      // Successful: redirect to new book record.
      res.redirect(book.url);
    });
  },
];
```

We then use a wildcard (\*) in the sanitizer to individually validate each of the genre array entries. The code below shows how - this translates to "sanitize every item below key genre".

```js
[
  // …
  body('genre.*').escape(),
  // …
];
```

### 14. Delete Author form:

Only allow to delete objects that are not referenced

Controller-get

```js
// Display Author delete form on GET.
exports.author_delete_get = (req, res, next) => {
  async.parallel(
    {
      author(callback) {
        Author.findById(req.params.id).exec(callback);
      },
      authors_books(callback) {
        Book.find({ author: req.params.id }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.author == null) {
        // No results.
        res.redirect('/catalog/authors');
      }
      // Successful, so render.
      res.render('author_delete', {
        title: 'Delete Author',
        author: results.author,
        author_books: results.authors_books,
      });
    }
  );
};
```

Controller post route:

```js
// Handle Author delete on POST.
exports.author_delete_post = (req, res, next) => {
  async.parallel(
    {
      author(callback) {
        Author.findById(req.body.authorid).exec(callback);
      },
      authors_books(callback) {
        Book.find({ author: req.body.authorid }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      // Success
      if (results.authors_books.length > 0) {
        // Author has books. Render in same way as for GET route.
        res.render('author_delete', {
          title: 'Delete Author',
          author: results.author,
          author_books: results.authors_books,
        });
        return;
      }
      // Author has no books. Delete object and redirect to the list of authors.
      Author.findByIdAndRemove(req.body.authorid, (err) => {
        if (err) {
          return next(err);
        }
        // Success - go to author list
        res.redirect('/catalog/authors');
      });
    }
  );
};
```

In view:

```html
<a href='<%= locals.bicycle.url + "/delete" %>'>Delete</a> this bicycle
```

In route:

```js
// POST request to delete Author.
router.post('/author/:id/delete', author_controller.author_delete_post);
```

Delete button:
make action empty to send post request to the same page you are on.

```js
<form method="post" action="">
  <p>Are you sure you want to delete <%= locals.bicycle.name %>?</p>
  <button type="submit">Delete</button>
</form>
```

do it before alone :id

### 15. Update Book form:

Controller-get route:

```js
// Display book update form on GET.
exports.book_update_get = (req, res, next) => {
  // Get book, authors and genres for form.
  async.parallel(
    {
      book(callback) {
        Book.findById(req.params.id)
          .populate('author')
          .populate('genre')
          .exec(callback);
      },
      authors(callback) {
        Author.find(callback);
      },
      genres(callback) {
        Genre.find(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.book == null) {
        // No results.
        const err = new Error('Book not found');
        err.status = 404;
        return next(err);
      }
      // Success.
      // Mark our selected genres as checked.
      for (const genre of results.genres) {
        for (const bookGenre of results.book.genre) {
          if (genre._id.toString() === bookGenre._id.toString()) {
            genre.checked = 'true';
          }
        }
      }
      res.render('book_form', {
        title: 'Update Book',
        authors: results.authors,
        genres: results.genres,
        book: results.book,
      });
    }
  );
};
```

Controller-post route:

```js
// Handle book update on POST.
exports.book_update_post = [
  // Convert the genre to an array
  (req, res, next) => {
    if (!Array.isArray(req.body.genre)) {
      req.body.genre =
        typeof req.body.genre === 'undefined' ? [] : [req.body.genre];
    }
    next();
  },

  // Validate and sanitize fields.
  body('title', 'Title must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('author', 'Author must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('summary', 'Summary must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('isbn', 'ISBN must not be empty').trim().isLength({ min: 1 }).escape(),
  body('genre.*').escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a Book object with escaped/trimmed data and old id.
    const book = new Book({
      title: req.body.title,
      author: req.body.author,
      summary: req.body.summary,
      isbn: req.body.isbn,
      genre: typeof req.body.genre === 'undefined' ? [] : req.body.genre,
      _id: req.params.id, //This is required, or a new ID will be assigned!
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.

      // Get all authors and genres for form.
      async.parallel(
        {
          authors(callback) {
            Author.find(callback);
          },
          genres(callback) {
            Genre.find(callback);
          },
        },
        (err, results) => {
          if (err) {
            return next(err);
          }

          // Mark our selected genres as checked.
          for (const genre of results.genres) {
            if (book.genre.includes(genre._id)) {
              genre.checked = 'true';
            }
          }
          res.render('book_form', {
            title: 'Update Book',
            authors: results.authors,
            genres: results.genres,
            book,
            errors: errors.array(),
          });
        }
      );
      return;
    }

    // Data from form is valid. Update the record.
    Book.findByIdAndUpdate(req.params.id, book, {}, (err, thebook) => {
      if (err) {
        return next(err);
      }

      // Successful: redirect to book detail page.
      res.redirect(thebook.url);
    });
  },
];
```

# Mongoose:

### 1. require mongoose with `const mongoose = require('mongoose')`

### 2. connect to mongoose with `mongoose.connect('url', () => {success}, (err) => {clg(err)}`

- url to local connect: `'mongodb://localhost/testdb'`
- or do: `mongoose.connect('url').then((result) => {success}).catch((err) => {})`
- or do:

```js
// Import the mongoose module
const mongoose = require('mongoose');

// Set up default mongoose connection
const mongoDB = 'mongodb://127.0.0.1/my_database';
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

// Get the default connection (Connection Object)
const db = mongoose.connection;

// Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
// if you need additional connection use mongoose.createConnection() which returns Connection object
```

### 3. create schema:

```js
const newSchema = new mongoose.Schema({
  field: value,
});
```

### 4. add methods to schema - virtual, static or methods, use normal funcitons

### 5. add middleware to schema .pre, .post

### 6. export schema as a model with `module.exports = mongoose.model('user', userSchema);`

### 7. create documents using `const user = await User.create({})`

- or do: `const user = new User({}); user.save();` (save returns a promise, you can do `.then((result) => {}).catch((err) => {}))`

# Documents setup:

- `node_modules`
- `views/partials` - views for normal views and partials to use inside of that views
- `routes` - have your User.js and other express routes
- `public` - has your public files like styles.ss `public/images` or `public/javascripts` or `public/stylesheets`
- `models` - for mongoose models
- `app.js` - main app

# Using Curl:

```
curl http://localhost:3000
-> Received a GET HTTP method

curl -X POST http://localhost:3000
-> Received a POST HTTP method

curl -X PUT http://localhost:3000
-> Received a PUT HTTP method

curl -X DELETE http://localhost:3000
-> Received a DELETE HTTP method
```
