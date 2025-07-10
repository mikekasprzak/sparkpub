+++
+++
Flexicon is a set of (draft) schema standards that build upon AT Protocol's Lexicon schema format.

* [Flexi schema](#flexi-schema) (AKA `.flexi` or `.flexi.jsonc`) is an intermediate schema format optimized for improved authoring
* [Flex schema](#flex-schema) (AKA `.flex`, `.flex.json`, or `application/flex+json`) is a published schema format for distribution and use

While not directly compatible with AtProto's Lexicon, many Flex and Flexi schemas can be exported as Lexicon scheamas, with
the Flexicon exclusive features omitted.


## Why Flexicon?

In 2025 I began a project attempting to implement ActivityPub on the BlueSky PDS server. While initially I approached
this as a set of standalone HTTP endpoints, as I studied Lexicon closer, it became clear that most of the ActivityPub
specification could be implemented with XRPC and Lexicon.

As this effort progressed, I discovered several things that needed to change to support ActivityPub correctly, as well
as several areas where authoring schemas could be improved.

Flexicon might be seen as my take on what a Lexicon v2 or v3 might look like.

Tangentially, my exploration of ActivityPub led me to discover a number of efforts to enhance it with many features
found in AT Protocol, all except the idea of a PDS. To me, the PDS is the "killer feature" of the AT Protocol,
thus SparkPub was born, with Flexicon as the schema dialect.


## What is SparkPub?

SparkPub is a collection of protocols and specifications that define a SparkPub Data Server (or SPDS). The SPDS is
a universal social data server inspired by the BlueSky/AT Protocol Personal Data Server.


## Flexicon vs Lexicon

Flexicon changes 

```json
{
  "lexicon": 1,
  "id": "pub.jammer.theme.idea",
  "defs": {
    "main": {
      "type": "record",
      "key": "tid"
    }
  }
}
```

Flex

```json
{
  "flexicon": 1,
  "id": "pub.jammer.theme.idea",
  "version": "1",
  "record": {
    "key": "tid"
  }
}
```

### Fields

* `version` - semver compatible version string. Required in published schemas. 

* `extends` - array of `nsid-v`'s this document inherits from.
  * in `flexi` this imports all members in FIFO (?) order, where whomever changes a type last is the priority.
  * in `flex` this is a list of ancestors only! If based on a published schema, the exact `@version` should be included.

* `defs` - specifies additional types.
  * Usage of a type named `main` is discouraged and will emit a warning, but is 

* [main]
  * `aliases` - array of `nsid` aliases to generate. Required by Lexicon exporter if multiple [main] types are included in the document.

* `object` [main] - specifies that the document describes an object. Replaces `defs/main.type=object` in Lexicon. 
* `ref` [main] - specifies that the document describes a reference. Replaces `defs/main.type=ref` in Lexicon. 
* `union` [main] - specifies that the document describes a union. Replaces `defs/main.type=union` in Lexicon. 

* `record` [main] - specifies that the document describes a record. Replaces `defs/main.type=record` in Lexicon. 
* `get` [main] - specifies that the document describes an HTTP GET function. Replaces `defs/main.type=query` in Lexicon.
  * `type` = `xrpc | well-known | http` (assumed `xrpc` if both `type` and `mount` are omitted, assumed `http` if only `mount` is provided), 
  * `mount` = `'/xrpc/$id' | '/.well-known/$id[-1]' | unknown` (must specify `mount` if `type` is `http`)
* `post` [main] - specifies that the document describes an HTTP POST function. Replaces `defs/main.type=procedure` in Lexicon.
  * `type` = `xrpc | well-known | http` (assumed `xrpc` if both `type` and `mount` are omitted, assumed `http` if only `mount` is provided), 
  * `mount` = `'/xrpc/$id' | '/.well-known/$id[-1]' | unknown` (must specify `mount` if `type` is `http`)
* `patch` [main] - specifies that the document describes an HTTP PATCH function.
  * `type` = `xrpc | well-known | http` (assumed `xrpc` if both `type` and `mount` are omitted, assumed `http` if only `mount` is provided), 
  * `mount` = `'/xrpc/$id' | '/.well-known/$id[-1]' | unknown` (must specify `mount` if `type` is `http`)
* `put` [main] - specifies that the document describes an HTTP PUT function.
  * `type` = `xrpc | well-known | http` (assumed `xrpc` if both `type` and `mount` are omitted, assumed `http` if only `mount` is provided), 
  * `mount` = `'/xrpc/$id' | '/.well-known/$id[-1]' | unknown` (must specify `mount` if `type` is `http`)
* `delete` [main] - specifies that the document describes an HTTP DELETE function.
  * `type` = `xrpc | well-known | http` (assumed `xrpc` if both `type` and `mount` are omitted, assumed `http` if only `mount` is provided), 
  * `mount` = `'/xrpc/$id' | '/.well-known/$id[-1]' | unknown` (must specify `mount` if `type` is `http`)
* `ws-pub` [main] - specifies that the document is a websocket publisher function.
* `ws-sub` [main] - specifies that the document is a websocket subscriber function. Replaces `defs/main.type=subscription` in Lexicon.
* `ws-pubsub` [main] - specifies that the document is a bidirectional websocket function.


### Types and Formats

* `string`
  * `ap-handle` - ActivityPub handle, which looks a lot like an email address
  * `ap-uri` - FEP ActivityPub `ap://` URI
  * `ap-identifier` - either a `ap-handle` or `did`
  * `any-identifier` - `at-handle`, `ap-handle`, or `did`
  * `semver` - Semantic version string. Expected to follow the popular "major.minor.patch" numeric syntax, but extended data can be included.
    * Syntax is `major[.minor][.patch][extra]`, where `[]` means optional, `major`/`minor`/`patch` are numbers, and `extra` is any alphanumeric+dash-dot-underscore string
  * `nsid-v` - like `nsid` (namespace id) with `@` versions. 
    * The syntax is similar to `package.json` dependencies. (TODO: lookup what this spec is called)
      * `pub.jammer.theme.idea@1` is a reference to version `1`
      * `pub.jammer.theme.idea@^0.1` references the latest minor version starting at `0.1` (i.e. it could be `0.4`, `0.11.6`, but not `1.1`).

* `float` - Like in Lexicon, usage is discouraged, so it will not work unless you opt-in by specifying a `format`
  * `format` = `js` - standard 64bit js float (stringable)
    * supports most `integer` features
    * must include a decimal-zero suffix (i.e. `10.0`) in `flex` exports (optional in `flexi`)
    * value may also be the strings `"infinity"`, `"-infinity"`, or `"nan"`
  * all other formats are assumed to be binary, and will use the `bytes` type in lexicon exports
    * `format` = `fp64` - IEEE 754 double precision float (binary)
    * `format` = `fp32` - IEEE 754 single precision float (binary)
    * `format` = `fp16` - IEEE half precision float (binary)
    * `format` = `bf16` - 16bit brain float, AKA `fp32` with less fraction (binary)


## Flexi schema

Flexi is an "authoring first" variant of Flex schema. 


## Flex schema

Flex is a stricter schema format than Flexi, optimized for distribution.

* Flex schemas can only reference other schemas published by the same author.
  * Flexi schemas can reference schemas pubished by others, but they will be embedded/inlined once converted to Flex
