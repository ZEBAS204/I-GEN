/**
 * Import React types to use with JSDoc
 * @typedef {import("react").ReactNode} ReactNode
 * @typedef {import("react").ConsumerProps} ConsumerProps
 */

/**
 * Higher-order component that allows to wrap a context with a component and
 * exclusively permit re-renders from that context with certain props.
 * @param {ReactNode} WrappedComponent The element to wrap around context
 * @param {ConsumerProps} contextPropSelector Function that returns props from context
 * @see https://stackoverflow.com/a/55730151 for more information
 *
 * @example
  //* Function that select and RETURNS props from a context
  const select = () => {
    const { someValue, otherValue, setSomeValue } = useContext(AppContext)
    return {
      somePropFromContext: someValue,
      setSomePropFromContext: setSomeValue,
      ...
    }
  }

  //* Component that will use the wrapped context (Use Memo/PureComponent)
  const MyComponent = React.memo(...
  ...
  )

  export default wrapContext(MyComponent, select)
 */
export function wrapContext(WrappedComponent, contextPropSelector) {
	return (props) => {
		if (typeof contextPropSelector !== 'function')
			throw new TypeError('contextPropSelector must be a function')

		const selectors = contextPropSelector() // Function to select and RETURN props from a context
		return <WrappedComponent {...selectors} {...props} />
	}
}
