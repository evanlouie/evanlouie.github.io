class TwoSum
  @question = () ->
    '''
    Given an array of integers, return indices of the two numbers such that they add up to a specific target.

    You may assume that each input would have exactly one solution, and you may not use the same element twice.
    '''

  @answer = () ->
    twoSum = (nums, target) ->
      for i, iIndex in nums
        for j, jIndex in nums
          if i + j is target and iIndex isnt jIndex then return [iIndex, jIndex]
