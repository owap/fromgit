[![Code Climate](https://codeclimate.com/github/OpenWhere/fromgit/badges/gpa.svg)](https://codeclimate.com/github/OpenWhere/fromgit)
[![Dependency Status](https://david-dm.org/openwhere/fromgit.svg)](https://david-dm.org/openwhere/fromgit)
[![Circle CI](https://circleci.com/gh/OpenWhere/fromgit/tree/master.svg?style=shield)](https://circleci.com/gh/OpenWhere/fromgit/tree/master)

# fromgit
Open-source, on-demand environments defined and built from your git repos

## Developer Setup
On your development machine, export two environment variables:
    export NODE_ENV=development
    export GITHUB_ID=your_github_app_id

In order to retrieve your github application id, you must first create a fromgit
application owned by your github user.  Take the following steps:

+ Visit and sign into `https://github.com`
+ Click on "settings" in the upper right corner
+ Click on "Applications" in the left menu
+ Create a new application
+ Fill in the required fields (The Authorization Callback URL is the same as your homepage URL with `/auth/github/callback` appended to it).

Running the application is simple:
    npm install
    grunt
    
Ensure you have an instance of `mongod` running on your localhost.
