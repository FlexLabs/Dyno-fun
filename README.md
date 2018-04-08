# Fun commands for Dyno

Commands should always return a promise.

### Subcommands
Subcommands can be added like so:
First define the subcommands in the parent command constructor

```Javascript
this.commands = [
  { name: 'awesomething', desc: 'Potato' },
  { name: 'evenawesomerthing', desc: 'Potato' },
];
```

Afterwards, the default command handler will look into that array and match a function name with the subcommand name.

So for example, for the `awesomething` subcommand, we would add a function on the parent command class with the same name as the subcommand:

```Javascript
async awesomething({ message, args }) {
  //insert awesome command code here
}
```

The arguments follow the same format as a non-subcommand.
