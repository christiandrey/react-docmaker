import React from 'react'

import { DocmakerEditor } from 'react-docmaker'
import 'react-docmaker/dist/index.css'

const App = () => {
  return <DocmakerEditor onSubmitChanges={console.log} />
}

export default App
