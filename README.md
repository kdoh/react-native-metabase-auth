# react-native-metabase-auth

react-native-metabase-auth makes uses of React Native's `AsyncStorage` to help you easily manage Metabase sessions and requests in React Native apps.

[![Build Status](https://travis-ci.org/kdoh/react-native-metabase-auth.svg?branch=master)](https://travis-ci.org/kdoh/react-native-metabase-auth)
[![Greenkeeper badge](https://badges.greenkeeper.io/kdoh/react-native-metabase-auth.svg)](https://greenkeeper.io/)

### Installation
Install the package with yarn
```sh
yarn add react-native-metabase-auth
```
### Usage overview
1. Log in a user by asking them for the baseUrl of their Metabase instance (metabase.company.com for example), their metabase username (often their email), and their password.
2. Make requests on behalf of the user using `Metabase.request('resource')`
3. When you're all done, use `Metabase.logout()` to destroy the session and remove it from storage.

For a more complete sense of integrating Metabase auth into a react natvie app, I'd recommend checking out [the example app](https://github.com/kdoh/react-native-metabase-auth-example)

### Metabase compatability
This package should work with all Metabase instances running Metabase 0.24 or later.

## Affiliation
While I am a Metabase team member, this package is just a side project of mine and should not be considered an official Metabase product. That being said, I hope you find it useful!
