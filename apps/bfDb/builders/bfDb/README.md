# BfDb -- the Bolt Foundry data model layer

Having stable infra on which to build means we can build better things faster.
Our data layer has a few main principles:

1. Configuring models through builders is better than configuring them through
   text / regular code.
2. Graphql is a distinct path from our backend code.
3. It should be trivial and free to add or remove models.
4. It should be extremly simple to test any model in isolation.
