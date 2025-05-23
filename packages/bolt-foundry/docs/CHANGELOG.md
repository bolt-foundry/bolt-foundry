# Changelog

All notable changes to the Bolt Foundry SDK will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Core Spec and SpecBuilder infrastructure
- Immutable builder pattern with .spec() and .specs() methods
- TypeScript-first API design
- Basic project structure and documentation

### In Progress

- Public API with boltFoundryClient.createAssistant()
- OpenAI chat completion format rendering
- Persona card XML generation

## [0.0.2.1] - Current

### Added

- Base `Spec` class with flexible value and name properties
- `SpecBuilder` class with immutable builder pattern
- `.spec(value)` method for individual string values
- `.specs(name, builderFn)` method for named groups
- `.getSpecs()` method to retrieve all specs
- Comprehensive unit tests for builder functionality
- TypeScript type safety throughout

### Technical

- Established builder pattern following functional programming principles
- Each method returns new instance for safe sharing and predictable state
- Support for nested spec composition and grouping

## Pre-0.0.2.1

### Added

- Initial project structure
- Existing telemetry integration with connectBoltFoundry
- OpenAI type definitions and compatibility
- Basic error handling infrastructure
