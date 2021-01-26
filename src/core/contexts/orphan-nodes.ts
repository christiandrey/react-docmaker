import { createContext, Dispatch, SetStateAction } from 'react'
import { Node } from 'slate'

const OrphanNodesContext = createContext<
  [Array<Node>, Dispatch<SetStateAction<Array<Node>>>]
>(null)

export default OrphanNodesContext
