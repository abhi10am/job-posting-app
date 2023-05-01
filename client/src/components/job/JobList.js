import Card from "components/Card"
import Loader from "components/Loader"
import Separator from "components/Separator"

const JobListItem = ({ data, jobDetailId, handleViewJobDetail }) => {
  return (
    <Card
      className={`text-gray-800 cursor-pointer ${jobDetailId === data.id ? 'outline outline-2 outline-primary-600' : ''}`}
      onClick={() => handleViewJobDetail(data.id)}
    >
      <div className="text-lg font-medium mb-1">{data.title}</div>
      <div className="flex items-center space-x-1 mb-1">
        <div className="text-xs text-gray-600">{data.companyName}</div>
      </div>
      <div className="flex items-center space-x-1 mb-2">
        <div className="text-xs text-gray-600">{data.category.name}</div>
        <Separator className="mx-2" />
        <div className="text-xs text-gray-600">{data.type.name}</div>
      </div>
      <div className="text-sm mb-3 font-medium text-gray-600">
        ₹ {data.salary}
      </div>
      <div className="flex flex-wrap space-x-1">
        {data.skills.split(', ').map((skill, index) => (
          <div key={index} className="px-2 py-1 bg-gray-200 text-xs rounded">{skill}</div>
        ))}
      </div>
    </Card>
  )
}

export const JobList = ({ jobs, jobDetailId, handleViewJobDetail, isLoading }) => {
  if (isLoading) return <Loader />

  if (!isLoading && !jobs) return (
    <div className="flex items-center justify-center">No data found</div>
  )

  return (
    <div className="space-y-2">
      {jobs.map((job) => (
        <JobListItem
          key={job.id}
          jobDetailId={jobDetailId}
          handleViewJobDetail={handleViewJobDetail}
          data={job}
        />
      ))}
    </div>
  )
}