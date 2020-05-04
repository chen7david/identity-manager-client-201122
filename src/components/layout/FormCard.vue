<template>
        <v-col align="center" cols="12">
            <v-card outlined elevation="0" class="pa-4"  max-width="400px">
              <slot name="title"></slot>
              <slot name="image"></slot>
              <slot name="form"></slot>
              <slot name="actions"></slot>
            </v-card>
        </v-col>
</template>

<script>
export default {
  name:'FormCard'
}
</script>