import * as React from "react";

export interface HelloProps { compiler: string; framework: string; }

export default class Hello extends React.Component<HelloProps, {}> {

  constructor(props: HelloProps) {
    super(props);
  }
  render() {
    return (
      <div className="Hello">
        <h1>Hello from {this.props.framework}!</h1>
        <p>
          This heading and paragraph you are reading were rendered using React within a Google AMP validated site.
        </p>
      </div>
    );
  }
}
