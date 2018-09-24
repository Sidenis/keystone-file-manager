# KeystoneJS file manager
>The tool lets you store files on your server, without using third-party services like Cloudinary. It simplifies the original keystone Storage API, takes care about setting File storage for your files, deletes useless files.
##### Requirements
Node >= v8.9.2
Mongo >= v3.4.0
The tool has **NOT** been tested on earlier versions.
##### Notice! 
As far as you're using `keystone-file-manage`r, you should not set [KeystoneJS file Storage](https://keystonejs.com/api/field/file), cause it's set inside of `keystone-file-manager`.

## Installing
 
```
npm install keystone-file-manager
```
## Getting started
`keystone-file-manager` is meant to be used in models. In order to use the it do the following:
1. Require `keystone` and `keystone-file-manager` (returns a javascript class).
2. Create an instance of `keystone.List`.
3. Create a new instance of `keystone-file-manager` and pass the instance of `keystone.List` to constructor.
4. Call `init` method on newly created instance of `keystone-file-manager`.
5. Call `add` method on the instance of `keystone.List`.
```
const keystone = require('keystone);
const keystoneFileManager = require('keystone-file-manager');
const model = new keystone.List('modelName');
new keystoneFileManager(model).init();
model.add(); // add fields here
```
## Configuration
Options are used as follows:
```js
keystone.init({
    'kfm public url': '/images/',
    'kfm virtual prop key': 'src',
    'kfm uploaded files storage': '/uploads/images/'
});
```

There are three of them presented:

##### `kfm uploaded files storage` 
###### Mandatory
Set path on the server where files will be stored.
###### Use case:
If you set the option to `/uploads/images/`, files will be stored in `/uploads/images/` folder on your server.

##### `kfm public url` 
###### Optional
Set the url where files will be reachable.
Default value: `/images/`
###### Use case:
You can set this option to `/path-to-images/`, then file with the name `my-file.jpg` will be reachable on `your-domain.com/path-to-images/my-file.jpg`

##### `kfm virtual prop key` 
###### Optional
Set the name of virtual property, where link to the file will be stored.
Default value: `src`
###### Use case:
Imagine, you have the following model:
```js
const keystone = require('keystone');
const types = keystone.Field.Types;
const fileManager = require('keystone-file-manager');
const model = new keystone.List('modelName);

new fileManager(model).init();

model.add({
        title: { type: types.Text },
        icon: { type: types.File }
    });
```

... and later, in your template, you're gonna to get the link to the file as follows (in example we're using `pug` template engine, but this is not mandatory):
```
img(src= icon.src)
```
Pay attention, that the link to the file is stored in `src` property. If you change the `kfm virtual prop key` to, for instance, `myBeatifulVirtualProp`, then link to the file will be stored there, like:
```
img(src= icon.myBeatifulVirtualProp)
```

## How it works
The tool is built according to Facade pattern. It reveals only one simple method init and for correct work requires model. Keystone-file-manager wraps the keystone `add` method and does some magic inside.
