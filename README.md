# README #

This README would normally document whatever steps are necessary to get your application up and running.

### What is this repository for? ###

* Quick summary
* Version
* [Learn Markdown](https://bitbucket.org/tutorials/markdowndemo)

### How do I get set up? ###

* Summary of set up

**Deployment:**
```
cd ~
git clone https://github.com/chrisshayan/theleaderio.git theleaderio
cd theleaderio
npm install

cd ..
mkdir deployment
npm install -g mpm-client
cd deployment

mpm-client init theleaderio
cd theleaderio
cp -p mpm.prod.json mpm.json
mpm-client build
mpm-client deploy
```
* Configuration
* Dependencies
* Database configuration
* How to run tests
* Deployment instructions
```
cd ~
git clone https://github.com/chrisshayan/theleaderio.git theleaderio
cd theleaderio
npm install

cd ..
mkdir deployment
npm install -g mpm-client
cd deployment

mpm-client init theleaderio
cd theleaderio
cp -p mpm.prod.json mpm.json
**Change the version in mpm.json to the new version**
mpm-client build
mpm-client deploy
```

### Contribution guidelines ###

* Writing tests
* Code review
* Other guidelines

### Who do I talk to? ###

* Repo owner or admin
* Other community or team contact
