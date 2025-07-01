const rootToLexiconMacros = {
  'flexicon': ['{ "lexicon": ',' }'],
  'object': ['{ "defs": { "main": { "type": "object"',' } } }'],
  'record': ['{ "defs": { "main": { "type": "record"',' } } }'],
}

const typeMacros = {
  'string': '{ "type": "string" }',
  'integer': '{ "type": "integer" }',
  'uri': '{ "type": "sring", "format": "uri" }',
  'nsid': '{ "type": "string", "format": "nsid" }',
  'did': '{ "type": "string", "format": "did" }',
  'datetime': '{ "type": "string", "format": "datetime" }',
}

const typeToLexiconMacros = {
}

const formatToLexiconMacros = {
  'tsid': 'tid',
}
