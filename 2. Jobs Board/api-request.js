const apiEndpoint = `https://api.smartrecruiters.com/v1/companies/${process.env.SMART_RECRUITER_ENV}/postings`;

const fetchAdditionalPages = async (totalFound) => {
  const noOfPages = Math.ceil(totalFound / limit);
  const promises = [];

  for (let i = 0; i < noOfPages - 1; i++) {
    promises.push(
      axios.get(apiEndpoint, {
        params: { limit, offset: limit + i * limit },
      }),
    );
  }

  try {
    const additionalPages = await Promise.all(promises);
    return additionalPages.flatMap((page) => page.data.content);
  } catch (error) {
    return [];
  }
};

/**
 * See {@link https://developers.smartrecruiters.com/docs/objects#posting} for full Posting object details
 */
export const getJobs = async (jobType) => {
  const { data } = await axios.get(apiEndpoint, { params: { limit } });

  let postings = data.content;

  if (data.totalFound > limit) {
    const additionalPostings = await fetchAdditionalPages(data.totalFound);
    postings = postings.concat(additionalPostings);
  }

  let filteredJobs = postings;

  if (jobType)
    filteredJobs = postings.filter((post) => {
      const type = post.customField.find((field) => field.fieldLabel === 'Career Page')?.valueLabel;
      return type?.toLowerCase() === jobTypesConstants.earlyCareers;
    });

  return filteredJobs.map((job) => ({
    title: job.name,
    location: job.location.city || 'Uncategorized',
    team: job.customField.find((field) => field.fieldLabel === 'CKO Department')?.valueLabel || 'Uncategorized',
    id: job.id,
    url: `https://jobs.smartrecruiters.com/${process.env.SMART_RECRUITER_ENV}/${job.id}`,
  }));
};
