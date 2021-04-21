Everything that needs to be loaded once goes here, e.g. Services, Interceptors, Guards, Http, Constants, Common
Module...

Core Module should only be imported once at the root module.

For services, rather use providedIn as recommended by docs, looks like an anti-pattern to CoreModule
