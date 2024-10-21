"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messages = void 0;
exports.messages = {
    /* istanbul ignore next */
    removedDeclarativeWrapping: (location, used) => `\
[declarativeWrappingPlugin]: The ${used.join(' / ')} object prop${used.length > 1 ? 's' : ''} used in the ${location} has been
moved to a plugin, as improved chaining APIs and the list() / nonNull() helpers functions are preferred.

On Fields: 

t.string('someField', { nullable: false })   ->    t.nonNull.string('someField')

On args: 

stringArg({ required: true })    ->    nonNull(stringArg())

If you would like to incrementally migrate, or prefer the existing API, it is now supported via the declarativeWrappingPlugin. 
Add this to your plugins array in your makeSchema config:

makeSchema({
  plugins: [declarativeWrappingPlugin(), ...]
})
`,
    removedDeclarativeWrappingShort: (location, used) => `\
[declarativeWrappingPlugin]: Additional warning for ${used.join(' / ')} at ${location}. Add the declarativeWrappingPlugin() to the plugins array to disable this message.
`,
    /* istanbul ignore next */
    removedFunctionShorthand: (typeName, fieldName) => `Since v0.18.0, Nexus no longer supports resolver shorthands like:\n\n    t.string("${fieldName}", () => ...).\n\nInstead please write:\n\n    t.string("${fieldName}", { resolve: () => ... })\n\n.`,
};
//# sourceMappingURL=messages.js.map