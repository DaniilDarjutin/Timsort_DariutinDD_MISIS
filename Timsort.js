//minrun
function getMinRun(arr) {
  let n = arr.length
  let r = 0
  while (n >= 64) {
    r |= n & 1
    n >>= 1
  }
  return n + r
}

// Insertion Sort
function insertionSort(arr, left, right) {
  for (let i = left + 1; i <= right; i++) {
    let key = arr[i]
    let j = i - 1
    while (j >= left && arr[j] > key) {
      arr[j + 1] = arr[j]
      j--
    }
    arr[j + 1] = key
  }
}

// ExponentialSearch (экспоненциальный поиск)
function exponentialSearch(key, arr, start, length) {
  let offset = 1
  let lastOffset = 0

  if (length === 0) return start

  while (offset < length && arr[start + offset] < key) {
    lastOffset = offset
    offset = (offset << 1) + 1
  }

  let lo = start + lastOffset
  let hi = Math.min(start + offset, start + length)

  while (lo < hi) {
    let mid = lo + ((hi - lo) >> 1)
    if (key > arr[mid]) {
      lo = mid + 1
    } else {
      hi = mid
    }
  }

  return lo
}

// Galloping Merge Sort
function gallopingMergeSort(arr, l, m, r) {
  const minGallop = 7
  let left = arr.slice(l, m + 1)
  let right = arr.slice(m + 1, r + 1)
  let i = 0,
    j = 0,
    k = l
  let countLeft = 0,
    countRight = 0

  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      arr[k++] = left[i++]
      countLeft++
      countRight = 0
    } else {
      arr[k++] = right[j++]
      countRight++
      countLeft = 0
    }

    if (countLeft >= minGallop) {
      let gallopEnd = exponentialSearch(right[j], left, i, left.length - i)
      while (i < gallopEnd) arr[k++] = left[i++]
      countLeft = 0
    } else if (countRight >= minGallop) {
      let gallopEnd = exponentialSearch(left[i], right, j, right.length - j)
      while (j < gallopEnd) arr[k++] = right[j++]
      countRight = 0
    }
  }

  while (i < left.length) arr[k++] = left[i++]
  while (j < right.length) arr[k++] = right[j++]
}

// Timsort
function timSort(arr) {
  const n = arr.length
  const minrun = getMinRun(arr)
  console.log(`minrun: ${minrun}`)

  let i = 0
  while (i < n) {
    let runStart = i
    let runEnd = i + 1

    // Поиск направления run
    if (runEnd < n && arr[runEnd] < arr[runEnd - 1]) {
      while (runEnd < n && arr[runEnd] < arr[runEnd - 1]) {
        runEnd++
      }
      arr.splice(runStart, runEnd - runStart,...arr.slice(runStart, runEnd).reverse())
    } else {
      while (runEnd < n && arr[runEnd] >= arr[runEnd - 1]) {
        runEnd++
      }
    }

    // Расширение до minrun
    if (runEnd - runStart < minrun) {
      let oldEnd = runEnd
      runEnd = Math.min(runStart + minrun, n)
    }

    // Сортировка вставками
    insertionSort(arr, runStart, runEnd - 1)
    i = runEnd
  }

  // Слияние run'ов
  for (let size = minrun; size < n; size *= 2) {
    for (let left = 0; left < n; left += 2 * size) {
      let mid = Math.min(left + size - 1, n - 1)
      let right = Math.min(left + 2 * size - 1, n - 1)
      if (mid < right) {
        gallopingMergeSort(arr, left, mid, right)
      }
    }
  }
}

//Тестовый массив
let arr = [1, 3, 5, 2, 4, 6, 8, 7]

console.log("Исходный массив:", arr)
console.time("Время сортировки Timsort")
timSort(arr)
console.timeEnd("Время сортировки Timsort")
console.log("Отсортированный массив:", arr)