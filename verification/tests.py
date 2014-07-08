import random


extra_tests_count = 3

TESTS = {
    "Basics": [],
    "Extra": [],
}


for n in range(5, 20):

    TESTS["Basics"].append({"input": (4, n), "answer": (4, n)})


for n in random.sample(range(13, 24), extra_tests_count):

    TESTS["Extra"].append({"input": (6, n), "answer": (6, n)})
