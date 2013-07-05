node-uniform-cache dummy implementation
=======================================

Uniform Cache is a collection of modules which present an identical or uniform interface to various caching mechanisms.

The interface provided is relatively basic to ensure portability between backing stores, but also provides a basic read-through mechanism.

This module represents the 'dummy' implementation, i.e. all fetch operations will return null unless used in read-through mode. No storage actually takes place.
This is the equivalent of 'no caching', but this implentation allows code that utilises the uniform-cache interface to disable all caching simply by switching the module name, handy for development/testing purposes.

More details are available through the separate README file in the root of the repository on GitHub.

###Module-specifics
This module takes no arguments, but does behave differently in that it will not store any data. Fetch commands will return null unless used in read-through mode, store, remove, and close commands are all no-op (though callbacks will still be executed), increment command will behave as if the key did not exist before the command ran.