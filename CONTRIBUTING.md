## Contributing to Node on FHIR

♥ [Node on FHIR](https://www.github.com/symptomatic/node-on-fhir) and want to get involved? Thanks!  There are plenty of ways you can help!

Please take a moment to review this document in order to make the contribution process easy and effective for everyone involved.

Following these guidelines helps to communicate that you respect the time of the developers managing and developing this open source project. In return, they should reciprocate that respect in addressing your issue or assessing patches and features.



## Debugging Code

There are two important mechanisms for debugging.  Setting an environment variable on the command line:

```js
DEBUG=true meteor run --settings settings.json
```

And also setting the following flags in the Meteor.settings file:

```js
{
  "public": {
    "loggingThreshold": "trace"  //debug, info, warn, trace
  },
  "private": {},
  "galaxy": {
    "env": {
      "MONGO_URL": "mongodb://....",
      "DEBUG": 1,
      "TRACE": 1
    }
  }
}
```



### Testing Policy 
Tests should be added for any major functionality that's submitted as a pull request.  A lack of tests in the pull request are a qualifying reason to reject the merge request.  


### Using the issue tracker

The [issue tracker](https://www.github.com/symptomatic/node-on-fhir/issues) is the preferred channel for [bug reports](#bugs), [features requests](#features) and [submitting pull requests](#pull-requests), but please respect the following restrictions:


<a name="bugs"></a>
### Bug reports

A bug is a _demonstrable problem_ that is caused by the code in the repository. Good bug reports are extremely helpful - thank you!

Guidelines for bug reports:

1. **Use the GitHub issue search** &mdash; check if the issue has already been reported.

2. **Check if the issue has been fixed** &mdash; try to reproduce it using the latest `master` or
   development branch in the repository.

3. **Isolate the problem** &mdash; ideally create a reduced test case and a live example.

A good bug report shouldn't leave others needing to chase you up for more information. Please try to
be as detailed as possible in your report. What is your environment? What steps will reproduce the
issue? What browser(s) and OS experience the problem? What would you expect to be the outcome? All
these details will help people to fix any potential bugs.

Example:

> Short and descriptive example bug report title
>
> A summary of the issue and the browser/OS environment in which it occurs. If suitable, include the
> steps required to reproduce the bug.
>
> 1. This is the first step
> 2. This is the second step
> 3. Further steps, etc.
>
> `<url>` - a link to the reduced test case
>
> Any other information you want to share that is relevant to the issue being reported. This might
> include the lines of code that you have identified as causing the bug, and potential solutions
> (and your opinions on their merits).


<a name="features"></a>
## Feature requests

Feature requests are welcome. But take a moment to find out whether your idea fits with the scope
and aims of the project. It's up to *you* to make a strong case to convince the project's developers
of the merits of this feature. Please provide as much detail and context as possible.


<a name="pull-requests"></a>
## Pull requests  

Good pull requests - patches, improvements, new features - are a fantastic help. They should remain
focused in scope and avoid containing unrelated commits.

**Please ask first** before embarking on any significant pull request (e.g. implementing features,
refactoring code, porting to a different language), otherwise you risk spending a lot of time
working on something that the project's developers might not want to merge into the project.

Please adhere to the coding conventions used throughout a project (indentation, accurate comments,
etc.) and any other requirements (such as test coverage).

Adhering to the following process is the best way to get your work included in the project:

1. [Fork](https://help.github.com/articles/fork-a-repo/) the project, clone your fork, and configure
   the remotes:

   ```bash
   # Clone your fork of the repo into the current directory
   git clone https://github.com/<your-username>/node-on-fhir.git

   # Navigate to the newly cloned directory
   cd node-on-fhir
   
   # Assign the original repo to a remote called "upstream"
   git remote add upstream https://github.com/symptomatic/node-on-fhir.git
   ```

2. If you cloned a while ago, get the latest changes from upstream:

   ```bash
   git checkout master
   git pull upstream master
   ```

3. Create a new topic branch (off the main project development branch) to contain your feature, change, or fix:

   ```bash
    git checkout -b <topic-branch-name>
   ```

4. Commit your changes in logical chunks. Please adhere to these [git commit message guidelines](http://tbaggery.com/2008/04/19/a-note-about-git-commit-messages.html)
   or your code is unlikely be merged into the main project. Use Git's [interactive rebase](https://help.github.com/articles/about-git-rebase/)
   feature to tidy up your commits before making them public.

5. Locally merge (or rebase) the upstream development branch into your topic branch:

   ```bash
   git pull [--rebase] upstream master
   ```

6. Push your topic branch up to your fork:

   ```bash
   git push origin <topic-branch-name>
   ```

7. [Open a Pull Request](https://help.github.com/articles/using-pull-requests/) with a clear title and description.


We want to make sure that you have a handle on git, feature branches, pull-requests, and otherwise managing git based development flow before we invite you to collaborate on the code.  

## Hacking on NPM Packages 

After you've begun diving into the code, you may find that you want to edit some of the user interface components.  You will need to `npm link` the `fhir-starter` package.  
```
git clone https://github.com/clinical-meteor/fhir-starter packages/fhir-starter  
meteor npm link packages/fhir-starter
```

We recommend doing all development of the `fhir-starter` library within the main application `core/ConstructionZone.jsx` page or on CodeSandbox.io or some similar service, and then submitting a pull request for publication.  We currently do not support development of the `fhir-starter` library from within an Atmosphere package.

Lastly, you may need to re-link the package each time you make updates.  :/  There is a `rollup --watch` command that you can use to ease this task; but its a bit brittle and easy to forget to run.   

**IMPORTANT**: By submitting a patch, you agree to allow the project owners to license your work under the terms of the [MIT License](LICENSE.txt).

## Coding Style Guide  

- Terseness causes obfuscation and errors.  Spell out variable names.  Don't use abbreviations.

- Practice defensive programming with circut breakers and bulkheads.  This begins by embracing the lodash `get()` function whenever you want to access a JSON object's field.  

- This is intended to be a 12 Factor App.  As part of this design philosophy, config variables are exposed as environment variables.  As such, all the application settings are stored in `Meteor.settings` which itself can be set via `METEOR_SETTINGS` at run time.  Any sort of variable that might be specific to a specific client or installation should be brought in the Meteor.settings file.  When in doubt, extract it out.  Use `get(Meteor, 'settings.public.foo')` and feel free to add custom fields to the settings file.  It's getting huge already, but that's okay.  Be sure to document the new settings fields that you introduce.  

- Quotes vs double quotes - an over-rated argument.  Start with double quotes, since it's required for creating valid JSON objects.  Understand that double and single quotes can reference each other, and depending on the parsing, string building, or evals in your code you may need to switch between the two.  We have this linting rule turned off.  Be responsible.

- Arrow functions vs `function`.  Arrow functions and destructuring are nice, but are terse and difficult to follow and maintain.  Use in this codebase is discouraged.  There are many programmers rushing to the latest ES6 tutorials and trying to embrace all the latest programing syntax.  Arrows have their time and place, but will be considered a sign of not having read the contributing guidelines.  

- Destructuring objects - `props` are one place where destructuring makes sense.  In most other places, overuse of destructuring causes code to be difficult to read, and therefore difficult to maintain.



