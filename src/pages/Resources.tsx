const Resources = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Resources</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Learning Materials</h2>
          <p className="text-gray-600">Access our curated collection of learning resources.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Workshop Materials</h2>
          <p className="text-gray-600">Download materials from our previous workshops.</p>
        </div>
      </div>
    </div>
  )
}

export default Resources