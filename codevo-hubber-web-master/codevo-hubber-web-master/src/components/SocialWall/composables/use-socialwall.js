import { visibilities } from './visibilities'

export const useSocialwall = () => {
  const filterTags = (tags, category) => {
    return tags.filter((t) => t.category === category)
  }

  return {
    visibilities,
    filterTags
  }
}
