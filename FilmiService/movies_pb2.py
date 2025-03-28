# -*- coding: utf-8 -*-
# Generated by the protocol buffer compiler.  DO NOT EDIT!
# NO CHECKED-IN PROTOBUF GENCODE
# source: movies.proto
# Protobuf Python Version: 5.29.0
"""Generated protocol buffer code."""
from google.protobuf import descriptor as _descriptor
from google.protobuf import descriptor_pool as _descriptor_pool
from google.protobuf import runtime_version as _runtime_version
from google.protobuf import symbol_database as _symbol_database
from google.protobuf.internal import builder as _builder
_runtime_version.ValidateProtobufRuntimeVersion(
    _runtime_version.Domain.PUBLIC,
    5,
    29,
    0,
    '',
    'movies.proto'
)
# @@protoc_insertion_point(imports)

_sym_db = _symbol_database.Default()




DESCRIPTOR = _descriptor_pool.Default().AddSerializedFile(b'\n\x0cmovies.proto\x12\x06movies\"\x1a\n\x0cMovieRequest\x12\n\n\x02id\x18\x01 \x01(\x05\"e\n\x12MovieCreateRequest\x12\r\n\x05title\x18\x01 \x01(\t\x12\x0c\n\x04year\x18\x02 \x01(\x05\x12\r\n\x05genre\x18\x03 \x01(\t\x12\x13\n\x0b\x64\x65scription\x18\x04 \x01(\t\x12\x0e\n\x06\x61\x63tors\x18\x05 \x03(\t\"q\n\x12MovieUpdateRequest\x12\n\n\x02id\x18\x01 \x01(\x05\x12\r\n\x05title\x18\x02 \x01(\t\x12\x0c\n\x04year\x18\x03 \x01(\x05\x12\r\n\x05genre\x18\x04 \x01(\t\x12\x13\n\x0b\x64\x65scription\x18\x05 \x01(\t\x12\x0e\n\x06\x61\x63tors\x18\x06 \x03(\t\"\x1e\n\rSearchRequest\x12\r\n\x05query\x18\x01 \x01(\t\"l\n\rMovieResponse\x12\n\n\x02id\x18\x01 \x01(\x05\x12\r\n\x05title\x18\x02 \x01(\t\x12\x0c\n\x04year\x18\x03 \x01(\x05\x12\r\n\x05genre\x18\x04 \x01(\t\x12\x13\n\x0b\x64\x65scription\x18\x05 \x01(\t\x12\x0e\n\x06\x61\x63tors\x18\x06 \x03(\t\"2\n\tMovieList\x12%\n\x06movies\x18\x01 \x03(\x0b\x32\x15.movies.MovieResponse\"!\n\x0e\x44\x65leteResponse\x12\x0f\n\x07message\x18\x01 \x01(\t2\xc6\x02\n\x0cMovieService\x12@\n\x0b\x43reateMovie\x12\x1a.movies.MovieCreateRequest\x1a\x15.movies.MovieResponse\x12;\n\x0cGetMovieById\x12\x14.movies.MovieRequest\x1a\x15.movies.MovieResponse\x12@\n\x0bUpdateMovie\x12\x1a.movies.MovieUpdateRequest\x1a\x15.movies.MovieResponse\x12;\n\x0b\x44\x65leteMovie\x12\x14.movies.MovieRequest\x1a\x16.movies.DeleteResponse\x12\x38\n\x0cSearchMovies\x12\x15.movies.SearchRequest\x1a\x11.movies.MovieListb\x06proto3')

_globals = globals()
_builder.BuildMessageAndEnumDescriptors(DESCRIPTOR, _globals)
_builder.BuildTopDescriptorsAndMessages(DESCRIPTOR, 'movies_pb2', _globals)
if not _descriptor._USE_C_DESCRIPTORS:
  DESCRIPTOR._loaded_options = None
  _globals['_MOVIEREQUEST']._serialized_start=24
  _globals['_MOVIEREQUEST']._serialized_end=50
  _globals['_MOVIECREATEREQUEST']._serialized_start=52
  _globals['_MOVIECREATEREQUEST']._serialized_end=153
  _globals['_MOVIEUPDATEREQUEST']._serialized_start=155
  _globals['_MOVIEUPDATEREQUEST']._serialized_end=268
  _globals['_SEARCHREQUEST']._serialized_start=270
  _globals['_SEARCHREQUEST']._serialized_end=300
  _globals['_MOVIERESPONSE']._serialized_start=302
  _globals['_MOVIERESPONSE']._serialized_end=410
  _globals['_MOVIELIST']._serialized_start=412
  _globals['_MOVIELIST']._serialized_end=462
  _globals['_DELETERESPONSE']._serialized_start=464
  _globals['_DELETERESPONSE']._serialized_end=497
  _globals['_MOVIESERVICE']._serialized_start=500
  _globals['_MOVIESERVICE']._serialized_end=826
# @@protoc_insertion_point(module_scope)
