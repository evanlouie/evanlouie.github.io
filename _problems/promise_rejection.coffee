class PromiseRejectionExample
   @async: () ->
    try
      # throw new Error "Argh!!!"
      return "hello"
    catch err
      # console.error "Caught:", err
      return err.message

   @promise: () ->
    promise = new Promise (resolve, reject) ->
      # reject "I've been rejected T.T"
      resolve "hi!"

    try
      return await promise
    catch err
      # console.error "Promise rejected:", err
      return "blah"

console.log PromiseRejectionExample.async()
console.log PromiseRejectionExample.promise()

# PromiseRejectionExample.promise()
#   .then (ret) ->
#     console.log ret
#   .catch (err) ->
#     console.error err
