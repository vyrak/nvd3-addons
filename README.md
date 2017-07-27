##Contributing

###Prequisites

  - install [Yarn](https://yarnpkg.com)

###Getting Started

At the root of this project, run `yarn` to install all the dependencies. That's it.

###Releasing Builds
At the root of this project, run `gulp` to build the release versions. The files will be put in the `./build` folder.

###Running Examples
Depending on what's installed & preference, a web server can be spun up by typing in one of the following commands at the project's root:

  - Ruby 1.9.2+ `ruby -run -e httpd -- -p <port> .`
  - Python 2.x `python -m SimpleHTTPServer <port>`
  - Python 3.x `python -m http.server <port>`

Navigate to `http://localhost:<port>/examples` in a browser. Explore.
