# Harness 0.1.6 compatibility

The shared Host and browser RPC descriptors supply a `create()` factory for every strict input and result codec. The eager `schema` remains available to older supported Hosts. Both representations use the same Zod validator; account authorization, sanitization, patch approval and trial-call execution remain owned by the existing service methods.

The `wire-factory` regression covers all five RPC methods and rejects invalid values through the factory. Release validation also checks the declarations from the target Harness build, because the minimum-version package check alone cannot detect newer codec requirements.
