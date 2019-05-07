# Molly Skowron Portfolio Website

> A portfolio website for a high school biology teacher.

## Usage

Edit the contents of the `src` directory only. Any changes made to the `out` directory will not be saved.

To modify website metadata, edit `src/info.yaml`.

To add pages, add markdown files (with extension `.md`) to the `src/md` directory. The markdown file name should end with a dash followed by a number indicating its order in the navigation. For example, to have the "Home" and "About Me" pages in that order in the navigation, create files `src/md/home-1.md` and `src/md/about-me-2.md`. Dashcase filenames will automatically be titlecased.

Add any images you'd like to embed in a page to the `src/img` directory. To embed them in a markdown file write `![Alt Text In Case Image Can't Load](/img/filename-of-image)` in the markdown file.

To add your resume, put a file called `resume.pdf` in `src/other`.

You should not need to edit `src/layout.hbs` or `src/style.scss`.

## Building and Development

Prior to doing anything, open a terminal, navigate to the `molly-portfolio-website` and run `yarn install` in the directory. You should only need to do this once.

To build the website and see what it looks like run `gulp watch` in the terminal. A web browser will open up showing your website. This website is only running on your computer. It has not been deployed to the internet as a result of running this command.

At this point you can make changes to the files in `src` as described in the previous section. Whenever you save a file the changes will be reflected in the open browser window.

The `gulp watch` command from before will not stop running until `CTRL+C` is pressed in the terminal. Once you are done editing/viewing your website, press `CTRL+C` in the terminal.

## Deployment

To deploy the website to the internet, run `yarn deploy` in the `molly-portfolio-website` directory. You may be prompted for your GitHub password.

To confirm that the website deployed successfully, navigate to `mollyskowron.com`. It may take a minute or two for your changes to be reflected.

## Author

**Tomer Aberbach**

* [Github](https://github.com/TomerAberbach)
* [NPM](https://www.npmjs.com/~tomeraberbach)
* [LinkedIn](https://www.linkedin.com/in/tomer-a)
* [Website](https://tomeraberba.ch)

## License

Copyright © 2019 [Tomer Aberbach](https://github.com/TomerAberbach)
