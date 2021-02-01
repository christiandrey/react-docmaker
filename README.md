# react-docmaker

> SlateJS based document template editor for React.

[![NPM](https://img.shields.io/npm/v/react-docmaker.svg)](https://www.npmjs.com/package/react-docmaker) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save react-docmaker
```

## Usage

Check out the [demo](https://christiandrey.github.io/react-docmaker/) in the [example folder](https://github.com/christiandrey/react-docmaker/tree/main/example).

```tsx
import React, { Component } from 'react'

import { DocmakerEditor } from 'react-docmaker'
import 'react-docmaker/dist/index.css'

class Example extends Component {
  render() {
    return <DocmakerEditor onSubmitChanges={console.log} />
  }
}
```

## License

MIT © [christiandrey](https://github.com/christiandrey)
