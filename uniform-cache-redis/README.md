node-uniform-cache Redis implementation
=======================================

Uniform Cache is a collection of modules which present an identical or uniform interface to various caching mechanisms.

The interface provided is relatively basic to ensure portability between backing stores, but also provides a basic read-through mechanism.

This implementation uses a redis server as a backing store, the persistence of cached data is therefore dictated by redis.

More details are available through the separate README file in the root of the repository on GitHub.

###Module-specifics
This module may optionally take some arguments, TODO.
Hostname, Port, Password, Database ID