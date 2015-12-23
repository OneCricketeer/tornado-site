import json


class BandwidthUsage():

    def __init__(self):
        self.bandwidth_class = "Unrestricted"
        self.policy_down = 0
        self.policy_up = 0
        self.actual_down = 0
        self.actual_up = 0

    def is_restricted(self):
        return self.bandwidth_class != "Unrestricted"

    def as_json(self):
        return json.dumps({'bandwidth_class': self.bandwidth_class,
                           'policy_bytes': {'down': self.policy_down, 'up': self.policy_up},
                           'actual_bytes': {'down': self.actual_down, 'up': self.actual_up}})