class Euler1
  @question = () ->
    '''
    If we list all the natural numbers below 10 that are multiples of 3 or 5, we get 3, 5, 6 and 9. The sum of these multiples is 23.

    Find the sum of all the multiples of 3 or 5 below 1000.
    '''

  @answer = () ->
    sum = 0
    sum += n for n in [1...1000] when n % 3 is 0 or n % 5 is 0

    return sum
