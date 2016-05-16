import React from 'react'
import ReactDOM from 'react-dom'
import TestUtils from 'react-addons-test-utils'

export class TestRigComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {keyVal: Math.random(), testComplete: false}
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.state.testComplete === true)
      this.state.expectationCallback()
  }
  triggerFinalRender() {
    this.setState({testComplete: true})
    // this.setState({keyVal: Math.random()}) -- probably don't need this anymore, but holding onto just in case it's useful again
  }
  setExpectationCallback(expectationCallback) {
    this.setState({expectationCallback})
  }
  render() {
    return (<div key={this.state.keyval}>{this.props.children}</div>)
  }
}

export default class TestRig {
  constructor(TestComponent) {
    if (TestComponent) this.boltOn(TestComponent)

    this.screwOn = this.boltOn
    this.screwOff = this.boltOff
  }
  boltOn(TestComponent) {
    this.div = document.createElement('div')
    this.component = ReactDOM.render(<TestRigComponent>{TestComponent}</TestRigComponent>, this.div)
    this.domNode = $(ReactDOM.findDOMNode(this.component))
  }
  boltOff() {
    ReactDOM.unmountComponentAtNode(this.div)
  }
  setExpectationCallback(expectationCallback) {
    this.component.setState({expectationCallback})
  }
  finish() { this.component.triggerFinalRender() }
  clickButton(buttonText) {
    var element = this.domNode.find(`button:contains('${buttonText}')`)[0]
    this.clickElement(element)
  }
  clickLink(label) {
    var element = this.domNode.find(`a:contains('${label}')`)[0]
    this.clickElement(element)
  }
  // In the event of a gnarly css selector, just pass the element:
  clickElement(element) {
    TestUtils.Simulate.click(element)
  }
  fillIn(selector, value) {
    var element = this.domNode.find(selector)
    this.fillInElement(element, value)
  }
  toggleCheckbox(selector) {
    var element = this.domNode.find(selector) // Selector should be specific to the checkbox
    $(element).prop('checked', !($(element)[0].checked))
    TestUtils.Simulate.change(element[0])
  }
  fillInElement(element, value) {
    element.val(value)
    var rawElement = (element.jquery ? element[0] : element) // React doesn't like dealing with a jQuery wrapper.
    TestUtils.Simulate.change(rawElement)
  }
}

/*
TODOS:
  1. Figure out to fire an error if the expecation callback block is never fired.
  2. Be able to add expectations in a chain, and then fire them all at once.
  3. Make firing the expectations an explicit thing, so that an accidental re-render doesn't mess things up.
*/
