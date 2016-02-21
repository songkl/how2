# how2

![Demo of using how2](https://raw.githubusercontent.com/santinic/how2/master/img/demo.gif)

how2 finds the simplest way to do something on a unix bash command line.
It's like `man`, but you can query it in natural language:

```$ how2 read file while is changing```


## Install
To install, run this command:

`npm install -g how2`

If you don't have npm, then [just install NodeJS](https://nodejs.org), it takes two seconds.


## Usage
If you don't specify a language **it defaults to Bash** unix command line.
To specify a language, use ```-l```

```
$ how2 -l python permutations of a list
```

## How does it work ?
Uses Google and Stackoverflow APIs, because Stackoverflow search on its own doesn't
works as well.


## Why ?
Because I can never remember how to do certain things. And reading man pages always takes too long.

![XKCD](http://imgs.xkcd.com/comics/tar.png)


## TODO
* Add automatic copy/paste from -i to command line
