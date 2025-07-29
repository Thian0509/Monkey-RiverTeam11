import React from 'react'

class Loading extends React.Component {
  render() {
    return (
      <div className="fixed top-0 left-0 bg-white flex justify-center items-center h-screen w-screen z-50">
        <i className="pi pi-spinner !text-4xl text-gray-500 animate-spin"></i>
      </div>
    );
  }
}

export default Loading;