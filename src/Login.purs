module Login (
             login
             ) where

import Effect.Aff
import Prelude

import Data.Argonaut.Core (stringify)
import Effect.Class (liftEffect)
import Effect.Console (log)
import Network.HTTP.Affjax (post)
import Network.HTTP.Affjax.Request (string)
import Network.HTTP.Affjax.Response (json)

login = launchAff do
  res <- post json "http://127.0.0.1:8081/api/v1.0/login" (string "asdf")
  liftEffect $ log $ "GET /api response: " <> (stringify res.response)
