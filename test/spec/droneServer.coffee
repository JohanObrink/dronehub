Feature "DroneServer",
	"In order to control my Drone",
	"as an authenticated client",
	"I want to be able to authenticate and transmit messages via WebSockets", ->

		Scenario "Authentication", ->
			server = createDroneServer()

			Given "am not authenticated", (done) ->
				me = clientIo.connect(host)
				me.on 'connect', (err) ->
					expect(err).to.not.exist
					done()

			And "There is a Drone accepting authentication", (done) ->
				addDrone (err, drone) ->
					expect(err).to.not.exist

					boat = clientIo.connect(host)
					boat.on 'connect', (err) ->
						expect(err).to.not.exist
						
						boat.emit 'connect_drone', drone.id, (err) ->
							expect(err).to.not.exist
							done()

			When "I call takeover", (done) ->
				done()

			Then "it should recieve my data", (done) ->
				done()