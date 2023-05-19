# Notes

Note-taking application made with:

- [AdonisJS](https://adonisjs.com/)
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Mantine](https://mantine.dev/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [React Router](https://reactrouter.com/)
- [Webpack](https://webpack.js.org/)
- [CKEditor5](https://ckeditor.com/ckeditor-5/)
- [SQLite](https://sqlite.org/)

## Table of Contents

- [Features](#features)
- [Installation](#installation)
  - [Run the development version](#run-the-development-version)
  - [Run the production version](#run-the-production-version)
- [Usage](#usage)
  - [Sections](#sections)
  - [Notes](#notes)
  - [Books](#books)
  - [Tags](#tags)
  - [Sources](#sources)
  - [Code snippets](#code-snippets)
  - [Search](#search)
  - [Special filters](#special-filters)
  - [Dark theme](#dark-theme)
  - [Open as a popup](#open-as-a-popup)
- [License](#license)

## Features

- Ability to group notes by sections, books, and tags.
- Full-text search with SQLite FTS4.
- Ability to add sources to notes.
- Dark theme support.
- Ability to add code snippets to notes.
- Application state is synchronized with the URL.

## Installation

1. Clone or download the repository.
2. Open the `client` folder in the terminal.
3. Run `npm install` to install dependencies.
4. Run `npm run prod` to generate JavaScript files for the interface.
5. Open the `server` folder in the terminal.
6. Run `cp .env.example .env` to create a new `.env` file.
7. Run `npm install` to install dependencies.
8. Run `npm update-db-schema` to generate the SQLite database.
9. Run `node ace add:fts` to add the FTS4 full-text search index to the SQLite database.
10. Run `node ace add:user` to add a new user to the database.

### Run the development version

11. Run `npm run dev` to run the development version of the server.

### Run the production version

11. Run `npm run build` to build the production version of the server.
12. Run `cp .env.example ./build/.env` to copy the `.env` file.
13. Run `mkdir ./build/database` to create the database folder.
14. Run `cp ./database/notes.db ./build/database/notes.db` to copy the database.
15. Run `cd build` to change the current folder to `build`.
16. Run `npm ci --production` to install production dependencies.
17. Change `NODE_ENV=development` to `NODE_ENV=production` inside the `.env` file.
18. Run `node server.js` to run the production version.

## Usage

### Sections

Before you can add new notes, you must create at least one section.  
To add a new section:

- Click on the three vertical dots icon in the header.

  ![Adding a new note](./screenshots/Screenshot%202023-05-16%20010858.png)

- Select `Sections` in the dropdown menu.
- A modal window with sections CRUD interface will open.  
  ![Sections CRUD](./screenshots/Screenshot%202023-05-16%20011516.png)

  Here you can add new sections for your notes and specify the color, title, and section name for the database.

  ![Section update form](./screenshots/Screenshot%202023-05-16%20011739.png)

### Notes

When you first open the application, it will show all your notes from all sections.  
You cannot add new notes in this view.

To add a new note, switch to one of your sections.  
To do this:

- Click on the `Notes` dropdown in the sidebar.

  ![Notes dropdown](./screenshots/Screenshot%202023-05-16%20012216.png)

- Click on one of your sections.

  ![Selecting a section](./screenshots/Screenshot%202023-05-16%20012332.png)

- Click on `Add`.

  ![Add new note button](./screenshots/Screenshot%202023-05-16%20012451.png)

- The new note modal will open.  
  Here you can write the note's content and specify the note's title.

  ![New note modal](./screenshots/Screenshot%202023-05-16%20012743.png)

### Books

Notes can be grouped by books.  
Each note may have only one book.  
To add a book to the note:

- Click on the book icon.

  ![Adding a new book](./screenshots/Screenshot%202023-05-16%20013322.png)

- The book administration modal will open.

  ![Book administration modal](./screenshots/Screenshot%202023-05-16%20013518.png)

  At the top of this modal, there is an input field.  
  This input field contains the current note's book.  
  When you type any string in this input, books with a similar name will appear in the list below.  
  To add a book with the name you typed, click the `Apply` button.  
  You can also add an existing book to your note by clicking on the book name in the list.  
  To remove the book from the current note, clear the input field and click `Apply`.

When you add a book to a note, the book's name will appear near the book icon.

![Note with book](./screenshots/Screenshot%202023-05-16%20014301.png)

You can click on this book's name to filter all notes with this name.

![Notes with the same book](./screenshots/Screenshot%202023-05-16%20014621.png)

To remove the filter, click on the cross icon or the red rectangle with the book's name.

You can also see a list of your books with the number of notes for each book by clicking on `Book` in the sidebar.

![Books in the sidebar](./screenshots/Screenshot%202023-05-16%20015514.png)

Click on a book in the list to see all notes with this book.

![List of books](./screenshots/Screenshot%202023-05-16%20015550.png)

### Tags

Notes can be grouped by tags.  
Each note may have multiple tags.  
To add tags to the note:

- Click on the tag icon.

  ![Adding new tags](./screenshots/Screenshot%202023-05-16%20015903.png)

- The tags administration modal will open.

  ![Tags administration modal](./screenshots/Screenshot%202023-05-16%20020227.png)

  At the top of this modal, there is a list of the current note's tags.  
  To add a new tag, type its name and press enter.  
  Or select a tag from the list and click it.  
  Or select a tag name from the autocomplete list while you type.  
  To save the tags, click `Apply`.

The note's tags appear at the bottom of the note.

![Note with tags](./screenshots/Screenshot%202023-05-16%20020625.png)

You can click on a tag to filter all notes with this tag.

![Notes with the same book](./screenshots/Screenshot%202023-05-16%20020930.png)

To remove the filter, click on the cross icon or the green rectangle with the tag's name.

You can also see a list of your tags with the number of notes for each tag by clicking on `Tags` in the sidebar.

![Tags in the sidebar](./screenshots/Screenshot%202023-05-16%20021130.png)

Select tags and click `Apply` to filter notes with these tags.

![List of tags](./screenshots/Screenshot%202023-05-16%20021234.png)

### Sources

You can add sources to your notes.  
To add a source to your note:

- Click on the three dots icon on top of the note.

  ![Adding a new source](./screenshots/Screenshot%202023-05-16%20021414.png)

- Select `Sources` in the dropdown menu.
- The sources administration modal will open.

  ![Sources administration](./screenshots/Screenshot%202023-05-16%20021610.png)

Notes with sources will have a globe icon with a number next to it.  
The number represents the number of sources the note has.  
Click on this number to see the list of the note's sources.

![Note with a source](./screenshots/Screenshot%202023-05-16%20021944.png)

Click on the source in the sources modal to open it in a new tab.

![Sources modal](./screenshots/Screenshot%202023-05-16%20022109.png)

### Code snippets

You can add code snippets to your notes.  
To add a code snippet to your note:

- Click here and select the language of the code snippet.

  ![Adding code snippets](./screenshots/Screenshot%202023-05-16%20170906.png)

- Then enter your code snippet inside the gray box.

If you want to add text after the code snippet, then click `Enter` three times inside the gray box.

### Search

When you type text in the search input field in the header, it acts as autocomplete.  
It will show a list of notes for which the title matches the entered text.  
You can click on a note title to open this note.  
If a book or tag name matches the entered text, it will also appear in the autocomplete dropdown.  
You can click on a book or tag name to filter notes by this book or tag.

![Search autocomplete](./screenshots/Screenshot%202023-05-16%20171157.png)

To perform a full-text search, enter search keywords in the search input field and press enter.  
Notes that have matching titles or content will appear in the notes list.  
Matching titles and content keywords will be highlighted.

![Full-text search](./screenshots/Screenshot%202023-05-16%20171605.png)

### Special filters

In the sidebar, there are special filters.

![Special filters](./screenshots/Screenshot%202023-05-16%20172011.png)

- `Random` allows you to sort notes in random order.
- `Calendar` allows you to view notes that were added on a specific date.
- `Without book` allows you to view notes that do not have a book.
- `Without tags` allows you to view notes that do not have tags.

### Dark theme

Click on this icon in the header to toggle between the light and dark themes.

![Dark and light theme toggle](./screenshots/Screenshot%202023-05-16%20022409.png)

Dark theme interface.

![Dark theme interface](./screenshots/Screenshot%202023-05-16%20022438.png)

### Open as a popup

If you want to open the application in a separate popup window, click on this icon in the header.

![Open as popup](./screenshots/Screenshot%202023-05-16%20172435.png)

## License

This project is licensed under the [MIT license](./LICENSE).
