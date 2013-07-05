node-uniform-cache Memory-store implementation
=======================================

Uniform Cache is a collection of modules which present an identical or uniform interface to various caching mechanisms.

The interface provided is relatively basic to ensure portability between backing stores, but also provides a basic read-through mechanism.

This implementation stores data in-memory and therefore will not persist between restarts.

More details are available through the separate README file in the root of the repository on GitHub.

###Module-specifics
This module takes no arguments, and exhibits no special behaviour.

###TODO
* implement garbage collection to reduce memory footprint by not retaining expired items