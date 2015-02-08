var toxi = require("toxiclibsjs");

(function(global){

    var Vec2D = toxi.geom.Vec2D;

    var Boid = function(aPos, aMS, aMF, aVel, aDimentions) {
      this.acceleration = new Vec2D(0,0);
      this.velocity = aVel;
      this.position = aPos
      this.r = 3.0;

      this.maxspeedBase = aMS;
      this.maxforceBase = aMF;
      this.maxspeed = this.maxspeedBase * 0.1;
      this.maxforce = this.maxforceBase * 0.1;

      this.dimentions = aDimentions;
    }
    var p = Boid.prototype;

    p.run = function(boids, vol, beat) {
        this.maxspeed = this.maxspeedBase * vol;
        this.maxforce = this.maxforceBase;

        this.flock(boids, beat);
        this.update();
        this.borders();
    };

    p.applyForce = function(force) {
      // We could add mass here if we want A = F / M
      this.acceleration.add(force);
    };

    // We accumulate a new acceleration each time based on three rules
    p.flock = function(boids, beat) {
      var sep = this.separate(boids);   // Separation
      var ali = this.align(boids);      // Alignment
      var coh = this.cohesion(boids);   // Cohesion
      // Arbitrarily weight these forces
      sep.scaleSelf(1 * beat);
      ali.scaleSelf(0.02);
      coh.scaleSelf(0.2);
      // Add the force vectors to acceleration
      this.acceleration.addSelf(sep);
      this.acceleration.addSelf(ali);
      this.acceleration.addSelf(coh);
    };

    // Method to update location
    p.update = function() {
      // Update velocity
      this.velocity.addSelf(this.acceleration);
      // Limit speed
      this.velocity.limit(this.maxspeed);
      this.position.addSelf(this.velocity);
      // Reset accelertion to 0 each cycle
      this.acceleration.clear();
    }

    // A method that calculates and applies a steering force towards a target
    // STEER = DESIRED MINUS VELOCITY
    p.seek = function(target) {
      var desired = target.subSelf(this.position);  // A vector pointing from the location to the target

      var d = desired.magnitude();

      if(d > 0) {
        desired.normalize();
      }

      desired.scaleSelf(this.maxspeed);
      // Steering = Desired minus Velocity
      var steer = desired.subSelf(this.velocity).limit(this.maxforce);

      return steer;
    };

    p.render = function(aCtx) {
      // aCtx.fillRect(0,0,1,1);
    };

    // Wraparound
    p.borders = function() {
      if (this.position.x < -this.r)  this.position.x = this.dimentions.width +this.r;
      if (this.position.y < -this.r)  this.position.y = this.dimentions.height+this.r;
      if (this.position.x > this.dimentions.width +this.r) this.position.x = -this.r;
      if (this.position.y > this.dimentions.height+this.r) this.position.y = -this.r;
    }

    // Separation
    // Method checks for nearby boids and steers away
    p.separate = function(boids) {
        // var desiredseparation = 25.0;
        var desiredseparation = 1.0;
        var steer = new Vec2D(0,0);
        var count = 0;
        // For every boid in the system, check if it's too close
        for (var i = 0; i < boids.length; i++) {
            var d = this.position.distanceTo(boids[i].position);
            // If the distance is greater than 0 and less than an arbitrary amount (0 when you are yourself)
            if ((d > 0) && (d < desiredseparation)) {
                // Calculate vector pointing away from neighbor
                var diff = this.position.subSelf(boids[i].position);
                diff.normalizeTo(1.0/d);
                steer.addSelf(diff);
                count++;            // Keep track of how many
            }
        }
        // Average -- divide by how many
        if (count > 0) {
            steer.scaleSelf(1.0/count);
        }

        // As long as the vector is greater than 0
        if (steer.magnitude() > 0) {
            // Implement Reynolds: Steering = Desired - Velocity
            steer.normalizeTo(this.maxspeed);
            steer.subSelf(this.velocity);
            steer.limit(this.maxforce);
        }
        
        return steer;
    };

    // Alignment
    // For every nearby boid in the system, calculate the average velocity
    p.align = function(boids) {
        // var neighbordist = 50;
        var neighbordist = 5;
        var sum = new Vec2D(0,0);
        var count = 0;
        for (var i = 0; i < boids.length; i++) {
            var d = this.position.distanceTo(boids[i].position);
            if ((d > 0) && (d < neighbordist)) {
                sum.addSelf(boids[i].velocity);
                count++;
            }
        }
        if (count > 0) {
            sum.scaleSelf(count);
            sum.normalizeTo(this.maxspeed);
            var steer = sum.subSelf(this.velocity);
            steer.limit(this.maxforce);
            return steer;
        } else {
            return new Vec2D(0,0);
        }
    };

    // Cohesion
    // For the average location (i.e. center) of all nearby boids, calculate steering vector towards that location
    p.cohesion = function(boids) {
        // var neighbordist = 50;
        var neighbordist = 2;
        var sum = new Vec2D(0,0);   // Start with empty vector to accumulate all locations
        var count = 0;
        for (var i = 0; i < boids.length; i++) {
            var d = this.position.distanceTo(boids[i].position);
            if ((d > 0) && (d < neighbordist)) {
                sum.addSelf(boids[i].position); // Add location
                count++;
            }
        }
            
        if (count > 0) {
            sum.scaleSelf(1.0/count);
            return this.seek(sum);  // Steer towards the location
        } else {
            return new Vec2D(0,0);
        }
    }

    global.Boid = (global.module || {}).exports = Boid;

})(this);