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
  console.log(`--- Сортировка вставками: [${left}…${right}]`)
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
  console.log(
    `Поиск вставки (галоп) для ${key} в диапазоне [${start}…${start + length - 1}]`
  )
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
  console.log(`\n Слияние подмассивов: [${l}…${m}] + [${m + 1}…${r}]`)
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
      console.log(`Переход в galloping-режим (слева) ${i}`)
      let gallopEnd = exponentialSearch(right[j], left, i, left.length - i)
      while (i < gallopEnd) arr[k++] = left[i++]
      countLeft = 0
    } else if (countRight >= minGallop) {
      console.log(`Переход в galloping-режим (справа) ${j}`)
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
      console.log(`Обнаружен убывающий run: [${runStart}…${runEnd - 1}]`)
      arr.splice(runStart, runEnd - runStart, ...arr.slice(runStart, runEnd).reverse())
    } else {
      while (runEnd < n && arr[runEnd] >= arr[runEnd - 1]) {
        runEnd++
      }
      console.log(`Обнаружен возрастающий run: [${runStart}…${runEnd - 1}]`)
    }

    // Расширение до minrun
    if (runEnd - runStart < minrun) {
      let oldEnd = runEnd
      runEnd = Math.min(runStart + minrun, n)
      console.log(`Расширение run: [${runStart}…${oldEnd - 1}] -> [${runStart}…${runEnd - 1}]`)
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
let arr = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
  11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
  21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
  31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
  41, 42, 43, 44, 45, 46, 47, 48, 49, 50,
  100, 101, 102, 103, 104, 105, 106, 107, 108, 109,
  110, 111, 112, 113, 114, 115, 116, 117, 118, 119,
  120, 121, 122, 123, 124, 125, 126, 127, 128, 129,
  130, 131, 132, 133, 134, 135, 136, 137, 138, 139,
  140, 141, 142, 143, 144, 145, 146, 147, 148, 149
]

console.log("Исходный массив:", arr)
console.time("Время сортировки Timsort")
timSort(arr)
console.timeEnd("Время сортировки Timsort")
console.log("Отсортированный массив:", arr)
