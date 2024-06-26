import { ref, reactive, watch, watchEffect, computed, onMounted } from "vue"

const usePagination = ({ contentPerPage, count }) => {
    const page = ref(1)
    const gaps = reactive({
        before: false,
        paginationGroup: [],
        after: true,
    })

    // Calculate the total number of pages
    const pageCount = ref(Math.ceil(count / contentPerPage))

    // Calculate the index of the last item on the current page
    const lastContentIndex = computed(() => page.value * contentPerPage)

    // Computed property for the index of the first item on the current page
    const firstContentIndex = computed(() => lastContentIndex.value - contentPerPage)

    // Generate pages between the first and last pages
    const pagesInBetween = ref([])

    const updatePagesInBetween = (newValue) => {
        if (newValue > 2) {
            pagesInBetween.value = Array.from({ length: newValue - 2 }, (_, i) => i + 2)
        } else {
            pagesInBetween.value = []
        }
    }
    onMounted(() => {
        updatePagesInBetween(pageCount.value)
    })
    // Update pagesInBetween when pageCount changes
    watch(
        () => pageCount.value,
        (newValue) => {
            updatePagesInBetween(newValue)
        }
    )

    // Update gaps and paginationGroup based on the current page
    watchEffect(() => {
        const currentLocation = pagesInBetween.value.indexOf(page.value)

        let paginationGroup = []
        let before = false
        let after = false

        if (page.value === 1) {
            paginationGroup = pagesInBetween.value.slice(0, 3)
        } else if (page.value === pageCount.value || page.value === pageCount.value - 1 || page.value === pageCount.value - 2) {
            paginationGroup = pagesInBetween.value.slice(-3, pageCount.value)
        } else if (page.value === 2) {
            paginationGroup = pagesInBetween.value.slice(currentLocation, currentLocation + 3)
        } else {
            paginationGroup = [page.value - 1, page.value, page.value + 1]
        }

        before = paginationGroup[0] > 2
        after = paginationGroup[2] < pageCount.value - 1

        gaps.before = before
        gaps.paginationGroup = paginationGroup
        gaps.after = after
    })

    // Change the page based on direction (true for forward, false for backward)
    const changePage = (direction) => {
        page.value = direction ? Math.min(page.value + 1, pageCount.value) : Math.max(page.value - 1, 1)
    }

    // Set the page safely, ensuring it is within valid bounds
    const setPageSAFE = (num) => {
        page.value = Math.min(Math.max(num, 1), pageCount.value)
    }

    // Update count and pageCount
    const updateCount = (newCount) => {
        pageCount.value = Math.ceil(newCount / contentPerPage)
    }

    return {
        totalPages: pageCount,
        nextPage: () => changePage(true),
        prevPage: () => changePage(false),
        setPage: setPageSAFE,
        firstContentIndex,
        lastContentIndex,
        page,
        gaps,
        updateCount,
    }
}

export default usePagination
