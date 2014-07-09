import itertools


TYPE_ERROR = False, {"error_code": 1, "message": "You should return a list/tuple of lists/tuples with integers."}
SIZE_ERROR = False, {"error_code": 2, "message": "Wrong size of answer."}
MAGIC_ERROR = False, {"error_code": 3, "message": "It's not a magic square."}
DOMINO_ERROR = False, {"error_code": 4, "message": "It's not a domino magic square."}
ALL_OK = True, {"error_code": 100, "message": "All ok."}

def check_data(data, user_result):
    size, number = data
    #check types
    check_container_type = lambda o: any(map(lambda t: isinstance(o, t), (list, tuple)))
    check_cell_type = lambda i: isinstance(i, int)
    if not (
        check_container_type(user_result) and
        all(map(check_container_type, user_result)) and
        all(map(lambda row: all(map(check_cell_type, row)), user_result))
    ):

        return TYPE_ERROR

    #check sizes
    check_size = lambda o: len(o) == size
    if not (check_size(user_result) and all(map(check_size, user_result))):

        return SIZE_ERROR

    #check is it a magic square
    seq_sum_check = lambda seq: sum(seq) == number
    diagonals_indexes = zip(*map(lambda i: ((i, i), (i, size - i - 1)), range(size)))
    values_from_indexes = lambda inds: itertools.starmap(lambda x, y: user_result[y][x], inds)
    if not (
        all(map(seq_sum_check, user_result)) and                              # rows
        all(map(seq_sum_check, zip(*user_result))) and                        # columns
        all(map(seq_sum_check, map(values_from_indexes, diagonals_indexes)))  # diagonals
    ):

        return MAGIC_ERROR

    #check is it domino square
    tiles = set()
    for x, y in itertools.product(range(size), range(0, size, 2)):

        tile = tuple(sorted((user_result[y][x], user_result[y + 1][x])))
        if tile in tiles:

            return DOMINO_ERROR

        tiles.add(tile)


    return ALL_OK


from checkio.signals import ON_CONNECT
from checkio import api
from checkio.referees.io import CheckiOReferee
from checkio.referees.cover_codes import unwrap_args

from tests import TESTS


api.add_listener(
    ON_CONNECT,
    CheckiOReferee(
        tests=TESTS,
        cover_code={
            'python-27': unwrap_args,
            'python-3': unwrap_args,
        },
        checker=check_data
    ).on_ready
)

'''
print(check_data(4, 5, set()))
print(check_data(4, 5, [(),]))
print(check_data(4, 5, [(0, 0, 0, 0), (0, 0, 0, 0), (0, 0, 0, 0), (0, 0, 0, 0)]))
print(check_data(4, 4, [(1, 1, 1, 1), (1, 1, 1, 1), (1, 1, 1, 1), (1, 1, 1, 1)]))
print(check_data(4, 5, [(0, 0, 2, 3), (0, 4, 1, 0), (4, 0, 0, 1), (1, 1, 2, 1)]))
'''
