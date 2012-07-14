Feature "DroneServer",
	"In order to control my Drone",
	"as an authenticated client",
	"I want to be able to authenticate and transmit messages via WebSockets", ->

		Scenario "Authentication", ->
			server = createDroneServer()

			Given ->
				I "am not authenticated", (done) ->
					me = clientIo.connect(host)
					me.on 'connect', (err) ->
						should.not.exist err
						done()

				And "There is a Drone accepting authentication", (done) ->
					boat = clientIo.connect(host)
					boat.on 'connect', ->
						boat.emit 'connect-drone', 'panda', (err) ->
							should.not.exist err
							done()

			When ->
				I "call takeover", ->

			Then "it should recieve my data", ->